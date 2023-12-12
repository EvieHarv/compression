import { COLORS } from "@/lib/constants";
import { Tree, TreeNode, TreeValue, locationMap } from "@/lib/structures/tree";
import {
  Circle,
  Coordinates,
  Line,
  Mafs,
  Polygon,
  Text,
  Transform,
  Vector,
  vec,
} from "mafs";
import { styled } from "styled-components";

/**
 * Defines spacings
 */
const NODE_SIZE = 2; // Size of each node.
const NODE_SIBLING_DIST = 0.5; // Spacing between sibling nodes
const TREE_SPACING = NODE_SIBLING_DIST * 2; // Spacing between separated tree segments
const VERTICAL_SPACING = -3.5; // How far in the y direction nodes are moved at each level
const BRANCH_TEXT_VERT = 0.3; // How far to move branch numbers up (if displayed)
const BRANCH_TEXT_HORIZ = 0.3; // How far to move branch numbers to the side (if displayed)

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
 * position values for x, y, and a recursive x-modifier.
 */
class VisValue<T extends TreeValue> extends TreeValue {
  x: number = 0;
  y: number = 0;
  mod: number = 0;
  innerValue: T;
  is_ghost: boolean = false; // used to strictly construct n_ary trees with consistent spacing.

  constructor(
    innerValue: T,
    x: number = 0,
    y: number = 0,
    mod: number = 0,
    is_ghost: boolean = false,
  ) {
    super();
    this.x = x;
    this.y = y;
    this.mod = mod; // Modifier - cascades added x-values down tree.
    this.innerValue = innerValue;
    this.is_ghost = is_ghost;
  }

  print(): string {
    return `${this.x}`;
  }

  getKey(): string {
    return `${this.x} | ${this.y} | ${this.mod} | ${this.innerValue.print()}`;
  }

  // order(other: this) {
  //   return this.x > other.x;
  // }

  equivalent(other: this): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

/**
 * Tree that tacks on special positional arguments used for visualization, and calculates positions.
 *
 * Basically "shadows" the actual tree of inspection—has the same inner values, but with
 * additional properties for positioning.
 *
 * Implements Reingold-Tilford (RT). Note that this implementation allows for negative
 * `x` values, and it is expected that the viewport be re-bound to fit.
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
    this.getBaseValues();
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
   *
   * Then, calls to shift conflicts.
   */
  getBaseValues() {
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
    // Assign initial position
    node.value.x = prevSiblingX + NODE_SIZE + NODE_SIBLING_DIST;
    node.value.y = level;

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
    let nodeContour: contourMap = {};
    this.getLeftContour(parent.children[index], 0, nodeContour);

    // Iterate over all this node's left siblings.
    let shiftValues = [];
    for (let j = 0; j < index; j++) {
      shiftValues.push(0);
      // Get the right contour of this sibling node (the largest `x` values at every sublevel)
      let siblingContour: contourMap = {};
      this.getRightContour(parent.children[j], 0, siblingContour);

      // Get the deepest y levels
      const deepestCurrent = Math.max(...Object.keys(nodeContour).map(Number));
      const deepestSiblings = Math.max(
        ...Object.keys(siblingContour).map(Number),
      );

      // Calculate largest overlap by iterating over each contour map level
      for (
        let level = parent.children[index].value.y + 1;
        level <= Math.min(deepestCurrent, deepestSiblings);
        level++
      ) {
        let distance = nodeContour[level] - siblingContour[level];
        if (distance + shiftValues[j] < NODE_SIZE + TREE_SPACING) {
          shiftValues[j] = NODE_SIZE + TREE_SPACING - distance;
        }
      }

      // If there's an overlap, shift this subtree over.
    }
    let shiftValue = Math.max(...shiftValues);
    if (shiftValue > 0) {
      parent.children[index].value.x += shiftValue;
      parent.children[index].value.mod += shiftValue;
      this.centerNodesBetween(
        parent,
        shiftValues.lastIndexOf(shiftValue),
        index,
      );
    }
  }

  private centerNodesBetween(
    parent: TreeNode<VisValue<T>>,
    leftIndex: number,
    rightIndex: number,
  ) {
    const numNodesBetween = rightIndex - leftIndex - 1;

    const leftNode = parent.children[leftIndex];
    const rightNode = parent.children[rightIndex];

    if (numNodesBetween > 0) {
      let distanceBetweenNodes =
        (rightNode.value.x - leftNode.value.x) / (numNodesBetween + 1);

      let count = 1;
      for (let i = leftIndex + 1; i < rightIndex; i++) {
        let middleNode = parent.children[i];

        let desiredX = leftNode.value.x + distanceBetweenNodes * count;
        let offset = desiredX - middleNode.value.x;

        // Hacky temp solution—better to do via contours instead.
        if (middleNode.children.length === 0) {
          middleNode.value.x += offset;
          middleNode.value.mod += offset;
        }

        count++;
        this.shiftConflicts(parent, i);
      }
      this.shiftConflicts(parent, rightIndex);
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
   * Recursively applies all `mod` values to children, shifting subtrees over,
   * and applies vertical spacing.
   */
  applyMods() {
    if (this.root) this.recurseApplyMods(this.root, this.root.value.mod);
  }
  private recurseApplyMods(node: TreeNode<VisValue<T>>, sumMods: number) {
    for (let i = 0; i < node.children.length; i++) {
      this.recurseApplyMods(node.children[i], sumMods + node.value.mod);
    }
    node.value.x += sumMods;
    // We apply vertical spacing here instead of when we originally assign it
    // because it's more nice to have simple y-levels for the math along the way.
    node.value.y *= VERTICAL_SPACING;
    node.value.mod = 0;
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
      new TreeBounds(
        node.value.x - NODE_SIZE / 2,
        node.value.x + NODE_SIZE / 2,
        node.value.y - NODE_SIZE / 2,
        node.value.y + NODE_SIZE / 2,
      ),
    );
  }
}

interface Props<U extends TreeValue, T extends Tree<U>> {
  tree: T;
  rotate?: number;
  labelBranches?: boolean;
  highlightLeaves?: boolean;
  highlightSubtrees?: Array<number[]>;
  highlightPaths?: Array<number[]>;
  highlightNodes?: Array<number[]>;
  hideNullBranches?: boolean;
}

export function GetTreeVisualization<U extends TreeValue, T extends Tree<U>>({
  tree,
  rotate = 0,
  labelBranches = false,
  highlightLeaves = true,
  highlightSubtrees = [],
  highlightPaths = [],
  highlightNodes = [],
  hideNullBranches = true,
}: Props<U, T>): [
  visTree: VisTree<U>,
  jsx: JSX.Element[],
  mafsTransform: vec.Matrix,
  viewBounds: TreeBounds,
] {
  /**
   * Takes a single node and gets the properly-placed Mafs representation of it.
   *
   * @param node Tree Node
   * @returns A Mafs element with the node value printed inside
   */
  const nodeToBox = (
    node: TreeNode<VisValue<U>>,
    location: number[],
  ): JSX.Element | null => {
    // TODO: Allow for coloring a node without gunking up the API
    //  on the TreeValue interface too much. Maybe apart of print()?
    if (node.value.innerValue.print() === null) {
      return null;
    }

    const highlightNode =
      (highlightLeaves && node.children.length === 0) ||
      locationMap.doIndicesContain(highlightNodes, location) ||
      locationMap.doIndicesContainStartingWith(highlightPaths, location) ||
      locationMap.areIndicesSubtreeOf(highlightSubtrees, location);

    return (
      <Transform key={node.value.getKey()}>
        <Circle
          center={[node.value.x, node.value.y]}
          radius={NODE_SIZE / 2}
          color={highlightNode ? "#00AA00" : "#000000"}
        ></Circle>
        <Text x={node.value.x} y={node.value.y} size={textSize}>
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
  const iterateTree = (
    node: TreeNode<VisValue<U>>,
    location: number[] = [],
  ): JSX.Element[] => {
    let arr: JSX.Element[] = [];

    let box = nodeToBox(node, location);
    if (box === null) {
      return [];
    }
    arr.push(box);

    // Generate current node representation

    // Iterate children.
    for (let i = 0; i < node.children.length; i++) {
      const childLocation = [...location, i];
      // Get the children's representations.
      let iterated = iterateTree(node.children[i], childLocation);

      // skip drawing branch lines for null node
      if (iterated.length === 0 && hideNullBranches) continue;

      const highlightBranch =
        locationMap.doIndicesContainStartingWith(
          highlightPaths,
          childLocation,
        ) || locationMap.areIndicesSubtreeOf(highlightSubtrees, location);

      arr = arr.concat(iterated);

      // Current node (top) and current child node (bottom)
      let topNode: vec.Vector2 = [node.value.x, node.value.y];
      let bottomNode: vec.Vector2 = [
        node.children[i].value.x,
        node.children[i].value.y,
      ];

      // Draw a line connecting these two nodes
      arr.push(
        <Line.Segment
          key={node.value.getKey() + node.children[i].value.getKey() + "line"}
          point1={[topNode[0], topNode[1] - 1]}
          point2={[bottomNode[0], bottomNode[1] + 1]}
          color={highlightBranch ? "#00AA00" : "#000000"}
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

  // Generate our tree and positions, grab final bounds.
  let visTree = new VisTree(tree);
  visTree.calculatePositions();
  const bounds = visTree.getBounds();

  let x_size = bounds.x.max - bounds.x.min;
  let y_size = bounds.y.max - bounds.y.min;

  const MAGIC_TEXT_NUM = 80; // TODO: Entirely arbitrary and a bit janky.
  const textSize = MAGIC_TEXT_NUM / Math.sqrt(x_size + 1);

  // We know positions now - get visual tree representation
  let jsxNodes: JSX.Element[] = [];
  if (visTree.root) jsxNodes = iterateTree(visTree.root);

  // Rotate the tree
  const radians = rotate * (Math.PI / 180);
  // Shifts corner to origin and rotates about the origin.
  let transform: vec.Matrix = vec
    .matrixBuilder()
    .translate(Math.abs(bounds.x.min), -Math.abs(bounds.y.max))
    .rotate(radians)
    .get();
  let boundVec: vec.Vector2 = [x_size, -y_size];
  boundVec = vec.rotate(boundVec, radians);

  const viewBounds = new TreeBounds(
    Math.min(boundVec[0], 0),
    Math.max(boundVec[0], 0),
    Math.min(boundVec[1], 0),
    Math.max(boundVec[1], 0),
  );

  return [visTree, jsxNodes, transform, viewBounds];
}

/**
 * Visualizes anything implementing a Tree structure, using the
 * Reingold-Tilford algorithm for determining node positions.
 *
 * See Rachel Lim's wonderful article for a basic understanding of the implementation:
 * https://rachel53461.wordpress.com/2014/04/20/algorithm-for-drawing-trees/
 *
 * However, that article does have some mistakes, and so this implementation attempts
 * to improve upon those. Especially in the manner of centering and shifting subtrees.
 *
 * Please note that if `node.value.print()` returns `null`, the node and all of it's
 * children will not be rendered, but positions in the tree will act as if it was.
 * This can be useful in constructing strict n-ary trees with nodal positioning
 * (see `lib/structures/bst.ts`).
 *
 * @param tree Any class implementing Tree.
 * @param rotate Rotates the tree around the origin (top-left corner), given in degrees.
 * @param labelBranches Toggles if branches are labeled with a number,
 *        0 at the leftmost branch and counting up.
 * @param highlightLeaves Automatically highlights all tree leaves.
 * @param highlightSubtrees Highlights the entire subtree of a node given by an indexed path.
 * @param highlightPaths Highlights every node and branch up to the final node in an indexed path.
 * @param highlightNodes Highlights a node given by an indexed path.
 * @param hideNullBranches Hides the branches to "nowhere" going to null nodes.
 */
export default function TreeVisualization<
  U extends TreeValue,
  T extends Tree<U>,
>({
  tree,
  rotate = 0,
  labelBranches = false,
  highlightLeaves = true,
  highlightSubtrees = [],
  highlightPaths = [],
  highlightNodes = [],
  hideNullBranches = true,
}: Props<U, T>) {
  // We abstract this out into it's own function so that we aren't
  // 100% tied to using the mafs container returned by this function.
  const [_, jsx, mafsTransform, viewBounds] = GetTreeVisualization({
    tree,
    rotate,
    labelBranches,
    highlightLeaves,
    highlightSubtrees,
    highlightPaths,
    highlightNodes,
    hideNullBranches,
  });
  // ^ also, should we memoize this? might be hard with the nested references

  // TODO: Currently, mobile styling (i.e. rotating) is expected
  //  to be done outside of the component. This is inconsistent
  //  with other components, but I'd like to maintain rotations
  //  as a more "outside" option. Maybe provide an auto-rotate default,
  //  with specific rotations as overrides? unsure.
  // TODO: Resize height if needed?
  return (
    <Container>
      <Mafs
        pan={false}
        viewBox={{
          x: [viewBounds.x.min, viewBounds.x.max],
          y: [viewBounds.y.min, viewBounds.y.max],
        }}
      >
        <Transform matrix={mafsTransform}>{jsx}</Transform>
      </Mafs>
    </Container>
  );
}

interface ForestProps<U extends TreeValue, T extends Tree<U>> {
  trees: T[];
  rotate?: number;
  labelBranches?: boolean;
  highlightLeaves?: boolean;
  highlightSubtrees?: Array<number[]>;
  highlightPaths?: Array<number[]>;
  highlightNodes?: Array<number[]>;
  hideNullBranches?: boolean;
}

/**
 * WIP
 */
export function ForestVisualization<U extends TreeValue, T extends Tree<U>>({
  trees,
  rotate = 0,
  labelBranches = false,
  highlightLeaves = true,
  highlightSubtrees = [],
  highlightPaths = [],
  highlightNodes = [],
  hideNullBranches = true,
}: ForestProps<U, T>) {
  trees.sort((a, b) => a.size() - b.size());
  const finalNodes: Array<{ el: JSX.Element[]; trf: vec.Matrix }> = [];
  let finalBounds = new TreeBounds(0, 0, 0, 0);

  // We only need one
  let transform: vec.Matrix = vec.matrixBuilder().get();

  trees.forEach((tree) => {
    const [_, jsx, mafsTransform, viewBounds] = GetTreeVisualization({
      tree,
      rotate,
      labelBranches,
      highlightLeaves,
      highlightSubtrees,
      highlightPaths,
      highlightNodes,
      hideNullBranches,
    });

    let individualTransform = vec
      .matrixBuilder()
      .translate(/* last one */ 0, 0);

    finalNodes.push({ el: jsx, trf: individualTransform });
  });

  return (
    <Container>
      <Mafs
        pan={false}
        viewBox={{
          x: [finalBounds.x.min, finalBounds.x.max],
          y: [finalBounds.y.min, finalBounds.y.max],
        }}
      >
        {finalNodes.map((node) => (
          <Transform matrix={transform}>{node.el}</Transform>
        ))}
        <Text x={0} y={0}>
          hi
        </Text>
      </Mafs>
    </Container>
  );
}

const Container = styled.div`
  pointer-events: none;
`;
