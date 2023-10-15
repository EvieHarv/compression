import { COLORS } from "@/lib/constants";
import { Tree, TreeNode, TreeValue } from "@/lib/encodings/tree";
import { Circle, Coordinates, Line, Mafs, Text, Transform, vec } from "mafs";
import { styled } from "styled-components";

/**
 * Supporting tree values for the visualization.
 */
class VisValue<T extends TreeValue> extends TreeValue {
  x: number = 0;
  y: number = 0;
  mod: number = 0;
  innerValue!: T;

  constructor(innerValue: T, x: number = 0, y: number = 0, mod: number = 0) {
    super();
    this.x = x;
    this.y = y;
    this.mod = mod; // Modifier
    this.innerValue = innerValue;
  }

  print(): string {
    return `${this.x}`;
    // return `${this.x} | ${this.y} | ${this.mod} | ${this.innerValue.print()}`;
  }

  getKey(): string {
    return `${this.x} | ${this.y} | ${this.mod} | ${this.innerValue.print()}`;
  }

  order(other: this) {
    return this.x > other.x;
  }

  equivalent(other: this): boolean {
    return this.x === other.x;
  }
}

type contourMap = { [key: number]: number };

/**
 * Tree that tacks on special positional arguments used for visualzation.
 *
 * Basically "shadows" the actual tree of inspection—has the same inner value, but with
 * some additional values tacked on for positioning.
 *
 * Implements most of the steps in Reingold-Tilford (RT).
 *
 * Also remember when I said I was abusing generics?
 * Yeah, lots of that.
 */
class VisTree<T extends TreeValue> extends Tree<VisValue<T>> {
  /**
   * Builds a new VisTree shadowing target tree.
   *
   * @param tree Tree to build shadow tree from
   */
  constructor(shadow: Tree<T>) {
    super();
    this.buildShadowTree(shadow);
  }

  /**
   * "Shadows" a tree—i.e. creates a copy of the tree, except every value
   * is wrapped in VisValue instead of the original type.
   *
   * @param tree The tree to shadow.
   */
  // In reality, it's a thin wrapper for recurseShadow()
  buildShadowTree(shadow: Tree<T>) {
    if (!shadow.root) {
      this.root = null;
      return;
    }
    // Wrap up tree
    const newRoot = this.recurseShadow(shadow.root);
    // Reassign
    this.root = newRoot;
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
   * Wrapper function to run all the steps for RT.
   * Expects a shadow tree to already have been built.
   */
  calculatePositions() {
    this.initialAssign();
    // TODO: this.checkAllChildrenOnScreen();
    this.applyMods();
  }

  /**
   * Preforms the initial postorder traversal in RT,
   * assigning based on sibling number.
   *
   * Also assigns y value while we're at it, which is trivial.
   */
  initialAssign() {
    if (this.root) this.recurseInitial(this.root);
  }

  /**
   * Does the actual postorder recursion.
   */
  private recurseInitial(
    node: TreeNode<VisValue<T>>,
    parent: TreeNode<VisValue<T>> | null = null,
    index: number = 0,
    level: number = 0,
  ) {
    for (let i = 0; i < node.children.length; i++) {
      this.recurseInitial(node.children[i], node, i, level + 1);
    }
    node.value.x = index;
    node.value.y = level;

    // At this point, we know all children already have their assignments,
    // and so we may do assignments based on that.
    let desiredX = 0;
    if (node.children.length === 1) {
      desiredX = node.children[0].value.x;
    } else if (node.children.length > 1) {
      desiredX =
        (node.children[0].value.x +
          node.children[node.children.length - 1].value.x) /
        2;
    }

    if (index === 0) {
      node.value.x = desiredX;
    } else {
      node.value.mod = node.value.x - desiredX;
    }

    if (node.children.length > 0 && index > 0) {
      if (parent) this.shiftConflicts(parent, index);
    }
  }

  private shiftConflicts(parent: TreeNode<VisValue<T>>, index: number) {
    console.log(parent.value.print());
    // All sub-shifts are good, shift the children of this node now,
    // starting with the 2nd from the leftmost child node.
    // Get the left contour (the least values at every sublevel)
    var nodeContour: contourMap = {};
    this.getLeftContour(parent.children[index], 0, nodeContour);

    // Iterate over all this node's left siblings.
    for (let j = 0; j < index; j++) {
      var siblingContour: contourMap = {};
      this.getRightContour(parent.children[j], 0, siblingContour);

      console.log(nodeContour);
      console.log(siblingContour);

      const deepestCurrent = Math.max(...Object.keys(nodeContour).map(Number));
      const deepestSiblings = Math.max(
        ...Object.keys(siblingContour).map(Number),
      );

      let shiftValue = 0;

      for (
        let level = parent.children[index].value.y + 1;
        level <= Math.min(deepestCurrent, deepestSiblings);
        level++
      ) {
        var distance = nodeContour[level] - siblingContour[level];
        if (distance + shiftValue < 1) {
          shiftValue = 1 - distance;
        }
      }

      if (shiftValue > 0) {
        parent.children[index].value.x += shiftValue;
        parent.children[index].value.mod += shiftValue;

        // TODO: Implement this. Only matters with node counts > 2, so.
        // CenterNodesBetween(node, sibling);

        shiftValue = 0;
      }
    }
  }

  getLeftContour(
    node: TreeNode<VisValue<T>>,
    sumMods: number = 0,
    contours: contourMap,
  ) {
    if (!(node.value.y in contours)) {
      contours[node.value.y] = node.value.x + sumMods;
    } else {
      contours[node.value.y] = Math.min(
        contours[node.value.y],
        node.value.x + sumMods,
      );
    }

    for (let i = 0; i < node.children.length; i++) {
      this.getLeftContour(node.children[i], sumMods + node.value.mod, contours);
    }
  }
  getRightContour(
    node: TreeNode<VisValue<T>>,
    sumMods: number = 0,
    contours: contourMap,
  ) {
    if (!(node.value.y in contours)) {
      contours[node.value.y] = node.value.x + sumMods;
    } else {
      contours[node.value.y] = Math.max(
        contours[node.value.y],
        node.value.x + sumMods,
      );
    }

    for (let i = 0; i < node.children.length; i++) {
      this.getRightContour(
        node.children[i],
        sumMods + node.value.mod,
        contours,
      );
    }
  }

  applyMods() {
    if (this.root) this.recurseApplyMods(this.root, this.root.value.mod);
  }
  private recurseApplyMods(node: TreeNode<VisValue<T>>, sumMods: number) {
    for (let i = 0; i < node.children.length; i++) {
      this.recurseApplyMods(node.children[i], sumMods + node.value.mod);
    }
    node.value.x += sumMods;
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
  let viewSizeX = 10;
  let viewSizeY = 10;

  const xF = 4.5; // X multiplication factor
  const yF = -3.5; // Y multiplication factor

  const nodeToBox = (node: TreeNode<VisValue<U>>): JSX.Element => {
    return (
      <Transform key={node.value.getKey()}>
        <Circle
          center={[node.value.x * xF, node.value.y * yF]}
          radius={1}
        ></Circle>
        <Text x={node.value.x * xF} y={node.value.y * yF} size={16}>
          {node.value.innerValue.print()}
        </Text>
      </Transform>
    );
  };

  const iterateTree = (node: TreeNode<VisValue<U>>): JSX.Element[] => {
    let arr: JSX.Element[] = [];

    arr.push(nodeToBox(node));

    for (let i = 0; i < node.children.length; i++) {
      arr = arr.concat(iterateTree(node.children[i]));

      let topNode: vec.Vector2 = [node.value.x * xF, node.value.y * yF];
      let bottomNode: vec.Vector2 = [
        node.children[i].value.x * xF,
        node.children[i].value.y * yF,
      ];

      let midpoint = 0; // todo, add branch nums

      arr.push(
        <Line.Segment
          key={node.value.getKey() + node.children[i].value.getKey()}
          point1={[topNode[0], topNode[1] - 1]}
          point2={[bottomNode[0], bottomNode[1] + 1]}
        ></Line.Segment>,
      );
    }

    return arr;
  };

  let visTree = new VisTree(tree);
  visTree.calculatePositions();

  let nodes = null;

  if (visTree.root) nodes = iterateTree(visTree.root);

  return (
    <Container>
      <Mafs
        pan={false}
        viewBox={{ x: [5, 50], y: [-viewSizeY * 2, viewSizeY] }}
      >
        {/* <Coordinates.Cartesian /> */}
        {/* <Vector tail={[0, 0]} tip={[viewSizeX, viewSizeY]} /> */}
        {nodes?.map((x) => x)}
      </Mafs>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid ${COLORS.text};
  pointer-events: none;
`;
