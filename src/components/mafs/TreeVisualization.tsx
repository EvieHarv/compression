import { COLORS } from "@/lib/constants";
import { Tree, TreeNode, TreeValue } from "@/lib/encodings/tree";
import { Mafs, Text } from "mafs";
import { styled } from "styled-components";

/**
 * Supporting tree values for the visualization.
 */
class VisValue<T extends TreeValue> extends TreeValue {
  x: number = 0;
  y: number = 0;
  mod: number = 0;
  innerValue: T | null = null;

  constructor(innerValue: T, x: number = 0, y: number = 0, mod: number = 0) {
    super();
    this.x = x;
    this.y = y;
    this.mod = mod;
    this.innerValue = innerValue;
  }

  print(): string {
    throw new Error("Unintended use.");
  }

  order(other: this) {
    return this.x > other.x;
  }

  equivalent(other: this): boolean {
    return this.x === other.x;
  }
}

/**
 * Tree that tacks on special positional arguments used for visualzation.
 *
 * Basically "shadows" the actual tree of inspection—has the same inner value, but with
 * some additional values tacked on for positioning.
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
  buildShadowTree(shadow: Tree<T>): void {
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
  const viewSizeX = 10;
  const viewSizeY = 10;

  const IterateTree = (tree: T) => {
    const visTree = new VisTree(tree);
    console.log(visTree);

    return (
      <Text x={0} y={0}>
        TODO
      </Text>
    );
  };

  return (
    <Container>
      <Mafs
        pan={false}
        viewBox={{ x: [-viewSizeX, viewSizeX], y: [-viewSizeY, viewSizeY] }}
      >
        {/* <Coordinates.Cartesian /> */}
        {/* <Vector tail={[0, 0]} tip={[viewSizeX, viewSizeY]} /> */}
        {IterateTree(tree)}
      </Mafs>
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid ${COLORS.text};
  pointer-events: none;
`;
