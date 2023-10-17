import { COLORS } from "@/lib/constants";
import { Tree, TreeNode, TreeValue } from "@/lib/encodings/tree";
import { Circle, Coordinates, Line, Mafs, Text, Transform, vec } from "mafs";
import { styled } from "styled-components";

/**
 * Defines spacings
 */
const NODE_SIZE = 2; // Size of each node.
const NODE_SIBLING_DIST = 0.5; // Spacing between sibling nodes
const TREE_SPACING = NODE_SIBLING_DIST * 2; // Spacing between seperated tree segments
const VERTICAL_SPACING = 3; // How far in the y direction nodes are moved at each level
const BRANCH_TEXT_VERT = 0.25; // How far to move branch numbers up (if displayed)
const BRANCH_TEXT_HORIZ = 0.25; // How far to move branch numbers to the side (if displayed)

/**
 * Helper class for calculating tree boundaries.
 * Used for setting the size of the Mafs viewport.
 */
class TreeBounds {
  x: {
    min: number;
    max: number;
  };
  y: {
    min: number;
    max: number;
  };

  constructor(x_min: number, x_max: number, y_min: number, y_max: number) {
    this.x = { min: x_min, max: x_max };
    this.y = { min: y_min, max: y_max };
  }

  /**
   * "Combines" bounds, taking the "largest"
   * (smallest min or largest max) values for each field.
   *
   * @param other Value to combine with
   * @returns A new combined TreeBounds
   */
  getCombined(other: TreeBounds): TreeBounds {
    return new TreeBounds(
      Math.min(this.x.min, other.x.min),
      Math.max(this.x.max, other.x.max),
      Math.min(this.y.min, other.y.min),
      Math.max(this.y.max, other.y.max),
    );
  }
}

/**
 * Helper type, simply stores tree contours in a {y-level: x-value} map.
 */
type contourMap = { [key: number]: number };

/**
 * Supporting value type for tree visualization.
 *
 * Wraps an inner value (the actual tree type) along with
 * position values for x, y, and a recursive x-modifer.
 */
class VisValue<T extends TreeValue> extends TreeValue {
  x: number = 0;
  y: number = 0;
  mod: number = 0;
  innerValue: T;

  constructor(innerValue: T, x: number = 0, y: number = 0, mod: number = 0) {
    super();
    this.x = x;
    this.y = y;
    this.mod = mod; // Modifier - cascades added x-values down tree.
    this.innerValue = innerValue;
  }

  print(): string {
    return `${this.x}`;
  }

  getKey(): string {
    return `${this.x} | ${this.y} | ${this.mod} | ${this.innerValue.print()}`;
  }

  order(other: this) {
    return this.x > other.x;
  }

  equivalent(other: this): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

/**
 * Tree that tacks on special positional arguments used for visualzation, and calculates positions.
 *
 * Basically "shadows" the actual tree of inspection—has the same inner values, but with
 * additional properties for positioning.
 *
 * Implements Reingold-Tilford (RT). Note that this implementation allows for negative
 * `x` values, and it is expected that the viewport be re-bound to fit.
 *
 * Note that `y` values are positve.
 */
class VisTree<T extends TreeValue> extends Tree<VisValue<T>> {
  /**
   * Builds a new VisTree shadowing the given target tree.
   *
   * @param tree Tree to build shadow tree from
   */
  constructor(shadow: Tree<T>) {
    super();
    this.buildShadowTree(shadow);
  }

  /**
   * Wrapper function to run all the steps for RT.
   * Expects a shadow tree to already have been built.
   */
  calculatePositions() {
    this.initialAssign();
    this.applyMods();
  }

  /**
   * "Shadows" a tree—i.e. creates a copy of the tree, except every value
   * is wrapped in VisValue instead of the original type.
   *
   * @param tree The tree to shadow.
   */
  buildShadowTree(shadow: Tree<T>) {
    if (!shadow.root) {
      this.root = null;
      return;
    }
    this.root = this.recurseShadow(shadow.root);
  }
  private recurseShadow(node: TreeNode<T>): TreeNode<VisValue<T>> {
    // Wrap up our value
    const wrapped = new TreeNode<VisValue<T>>(new VisValue(node.value));

    // Wrap up all children
    for (let i = 0; i < node.children.length; i++) {
      wrapped.children[i] = this.recurseShadow(node.children[i]);
    }

    // Bubble back up
    return wrapped;
  }

  /**
   * Preforms the initial postorder traversal in RT,
   * getting the first-step `x` and final `y` values.
   */
  initialAssign() {
    if (this.root) this.recurseInitial(this.root);
  }
  private recurseInitial(
    node: TreeNode<VisValue<T>>,
    parent: TreeNode<VisValue<T>> | null = null,
    index: number = 0,
    level: number = 0,
  ) {
    // Iterate over all children
    for (let i = 0; i < node.children.length; i++) {
      this.recurseInitial(node.children[i], node, i, level + 1);
    }

    // If this node has left siblings, base position on those.
    let prevSiblingX = 0;
    if (index > 0 && parent) {
      prevSiblingX = parent.children[index - 1].value.x;
    }
    // Assign intial position
    node.value.x = prevSiblingX + NODE_SIZE + NODE_SIBLING_DIST;
    node.value.y = level * VERTICAL_SPACING;

    // At this point, we know all children already have their assignments,
    // and so we may do updated midpoint assignments based on that.
    let desiredX = 0; // Either the midpoint between children or directly above a child.
    if (node.children.length === 1) {
      desiredX = node.children[0].value.x;
    } else if (node.children.length > 1) {
      // Get the midpoint of all children
      desiredX =
        (node.children[0].value.x +
          node.children[node.children.length - 1].value.x) /
        2;
    }

    // If this node is the leftmost node, simply set the desired x value.
    if (index === 0) {
      node.value.x = desiredX;
    } else {
      // If it isn't the leftmost node, set the modifier to shift children.
      node.value.mod = node.value.x - desiredX;
    }

    // If this node has children and has leftward siblings, arrange their subtrees
    // via contour checking.
    if (node.children.length > 0 && index > 0) {
      if (parent) this.shiftConflicts(parent, index);
    }
  }
  /**
   * Checks contours and shifts node over as to not conflict with subtrees of sibling nodes.
   *
   * @param parent Parent of the node of inspection
   * @param index The index of the node of inspection
   */
  private shiftConflicts(parent: TreeNode<VisValue<T>>, index: number) {
    // We assume that all leftward and subtree shifts have been handled by this point,
    // so we may shift this node now.

    // Get the left contour of this node (the least `x` values at every sublevel)
    var nodeContour: contourMap = {};
    this.getLeftContour(parent.children[index], 0, nodeContour);

    // Iterate over all this node's left siblings.
    for (let j = 0; j < index; j++) {
      // Get the right contour of this sibling node (the largest `x` values at every sublevel)
      var siblingContour: contourMap = {};
      this.getRightContour(parent.children[j], 0, siblingContour);

      // Get the deepest y levels
      const deepestCurrent = Math.max(...Object.keys(nodeContour).map(Number));
      const deepestSiblings = Math.max(
        ...Object.keys(siblingContour).map(Number),
      );

      // Calculate largest overlap by iterating over each contour map level
      let shiftValue = 0;
      for (
        let level = parent.children[index].value.y + 1;
        level <= Math.min(deepestCurrent, deepestSiblings);
        level++
      ) {
        var distance = nodeContour[level] - siblingContour[level];
        if (distance + shiftValue < NODE_SIZE + TREE_SPACING) {
          shiftValue = NODE_SIZE + TREE_SPACING - distance;
        }
      }

      // If there's an overlap, shift this subtree over.
      if (shiftValue > 0) {
        parent.children[index].value.x += shiftValue;
        parent.children[index].value.mod += shiftValue;

        // TODO: Implement this. Only matters with node counts > 2.
        // this.centerNodesBetween(node, sibling);
      }
    }
  }

  /**
   * Assigns left (minimum) contour values to the pass-by-reference `contours`.
   *
   * @param node Node to start at
   * @param sumMods Running sum of `x` modifiers
   * @param contours Pass-by-reference contour map to assign to.
   */
  getLeftContour(
    node: TreeNode<VisValue<T>>,
    sumMods: number = 0,
    contours: contourMap,
  ) {
    // Check if this `y` level exists in the map.
    // If it doesn't, make an entry.
    // If it does, compare to the previous entry and grab the minimum.
    if (!contours.hasOwnProperty(node.value.y)) {
      contours[node.value.y] = node.value.x + sumMods;
    } else {
      contours[node.value.y] = Math.min(
        contours[node.value.y],
        node.value.x + sumMods,
      );
    }

    // Run for all sublevels.
    for (let i = 0; i < node.children.length; i++) {
      this.getLeftContour(node.children[i], sumMods + node.value.mod, contours);
    }
  }
  // These two contour functions above & below differ based on simply Math.min vs Math.max
  /**
   * Assigns right (maximum) contour values to the pass-by-reference `contours`.
   *
   * @param node Node to start at
   * @param sumMods Running sum of `x` modifiers
   * @param contours Pass-by-reference contour map to assign to.
   */
  getRightContour(
    node: TreeNode<VisValue<T>>,
    sumMods: number = 0,
    contours: contourMap,
  ) {
    // Check if this `y` level exists in the map.
    // If it doesn't, make an entry.
    // If it does, compare to the previous entry and grab the minimum.
    if (!contours.hasOwnProperty(node.value.y)) {
      contours[node.value.y] = node.value.x + sumMods;
    } else {
      contours[node.value.y] = Math.max(
        contours[node.value.y],
        node.value.x + sumMods,
      );
    }

    // Run for all sublevels.
    for (let i = 0; i < node.children.length; i++) {
      this.getRightContour(
        node.children[i],
        sumMods + node.value.mod,
        contours,
      );
    }
  }

  /**
   * Recursively applies all `mod` values to children, shifting subtrees over.
   */
  applyMods() {
    if (this.root) this.recurseApplyMods(this.root, this.root.value.mod);
  }
  private recurseApplyMods(node: TreeNode<VisValue<T>>, sumMods: number) {
    for (let i = 0; i < node.children.length; i++) {
      this.recurseApplyMods(node.children[i], sumMods + node.value.mod);
    }
    node.value.x += sumMods;
  }

  /**
   * Finds the rectangular bounding box of the tree.
   *
   * @returns Bounds of the tree
   */
  getBounds(): TreeBounds {
    if (this.root) return this.getBoundsRecursive(this.root);
    return new TreeBounds(0, 0, 0, 0);
  }
  private getBoundsRecursive(node: TreeNode<VisValue<T>>): TreeBounds {
    let bounds = new TreeBounds(0, 0, 0, 0);

    for (let i = 0; i < node.children.length; i++) {
      bounds = bounds.getCombined(this.getBoundsRecursive(node.children[i]));
    }

    return bounds.getCombined(
      new TreeBounds(node.value.x, node.value.x, node.value.y, node.value.y),
    );
  }
}

interface Props<U extends TreeValue, T extends Tree<U>> {
  tree: T;
  labelBranches?: boolean;
}

/**
 * Visualizes anything implementing a Tree structure, using the
 * Reingold-Tilford algorithm for determining node positions.
 *
 * See Rachel Lim's wonderful article for implementation explanations:
 * https://rachel53461.wordpress.com/2014/04/20/algorithm-for-drawing-trees/
 *
 * @param tree Any class implementing Tree.
 * @param labelBranches Toggles if branches of a node are labeled with a number,
 *        0 at the leftmost branch and counting up.
 */
export default function TreeVisualization<
  U extends TreeValue,
  T extends Tree<U>,
>({ tree, labelBranches = false }: Props<U, T>) {
  /**
   * Takes a single node and gets the properly-placed Mafs representation of it.
   *
   * @param node Tree Node
   * @returns A Mafs element with the node value printed inside
   */
  const nodeToBox = (node: TreeNode<VisValue<U>>): JSX.Element => {
    return (
      <Transform key={node.value.getKey()}>
        <Circle center={[node.value.x, -node.value.y]} radius={1}></Circle>
        <Text x={node.value.x} y={-node.value.y} size={textSize}>
          {node.value.innerValue.print()}
        </Text>
      </Transform>
    );
  };

  /**
   * Recursively generates tree elements based on their VisValue<T> positions.
   *
   * @param node Tree Node
   * @returns All sublevels of this node represented as Mafs elements
   */
  const iterateTree = (node: TreeNode<VisValue<U>>): JSX.Element[] => {
    let arr: JSX.Element[] = [];

    // Generate current node representation
    arr.push(nodeToBox(node));

    // Iterate children.
    for (let i = 0; i < node.children.length; i++) {
      // Get the children's representations.
      arr = arr.concat(iterateTree(node.children[i]));

      // Current node (top) and current child node (bottom)
      let topNode: vec.Vector2 = [node.value.x, -node.value.y];
      let bottomNode: vec.Vector2 = [
        node.children[i].value.x,
        -node.children[i].value.y,
      ];

      // Draw a line connecting these two nodes
      arr.push(
        <Line.Segment
          key={node.value.getKey() + node.children[i].value.getKey() + "line"}
          point1={[topNode[0], topNode[1] - 1]}
          point2={[bottomNode[0], bottomNode[1] + 1]}
        ></Line.Segment>,
      );

      // Create text labeling branches if requested.
      if (labelBranches) {
        // Midpoint of the connecting line
        let midpoint: vec.Vector2 = [
          (topNode[0] + bottomNode[0]) / 2,
          (topNode[1] + bottomNode[1]) / 2,
        ];

        // Will always equal +-1, indicates direction of line slope.
        let slopeDir =
          (topNode[1] - bottomNode[1]) / (topNode[0] - bottomNode[0]) > 0
            ? -1
            : 1;

        // Move text-point over.
        midpoint[0] += BRANCH_TEXT_HORIZ * slopeDir;
        midpoint[1] += BRANCH_TEXT_VERT;

        // Create text
        arr.push(
          <Text
            key={node.value.getKey() + node.children[i].value.getKey() + "text"}
            x={midpoint[0]}
            y={midpoint[1]}
            size={textSize}
          >
            {i}
          </Text>,
        );
      }
    }

    return arr;
  };

  // Generate our tree and positons, grab final bounds.
  let visTree = new VisTree(tree);
  visTree.calculatePositions();
  const bounds = visTree.getBounds();

  const textSize = 18; // TODO: calculate on-the-fly.

  // We know positions now - get visual tree representation
  let jsxNodes: JSX.Element[] = [];
  if (visTree.root) jsxNodes = iterateTree(visTree.root);

  return (
    <Container>
      <Mafs
        pan={false}
        viewBox={{
          x: [bounds.x.min - 1, bounds.x.max + 1],
          y: [-bounds.y.max - 1, -bounds.y.min + 1],
        }}
      >
        {/* <Coordinates.Cartesian /> */}
        {jsxNodes}
      </Mafs>
    </Container>
  );
}

const Container = styled.div`
  /* border: 1px solid ${COLORS.text}; */
  pointer-events: none;
`;
