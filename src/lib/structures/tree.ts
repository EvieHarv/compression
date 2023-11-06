/**
 * Defines an abstract interface for trees.
 *
 * Primarily useful for implementing functions over
 * a tree of an unknown type, such as the tree
 * visualization component.
 */

/**
 * A value that will be held by a node.
 * Values may be complex, and so a class is best suited for this purpose.
 *
 * For example, a class Huffman may contain both a `count: number` and a `char: string`
 */
export abstract class TreeValue {
  /**
   * Produces a pretty output for the type.
   *
   * Primarily intended for visualization purposes,
   * and so should be end-user friendly.
   */
  abstract print(): string | null;

  /**
   * Compares two nodes, returning true if they are logically equivalent.
   *
   * @param other A tree value of the same type to compare to
   */
  abstract equivalent(other: this): boolean;
}

/**
 * An individual node in a tree, with values of a certain type.
 */
export class TreeNode<T extends TreeValue> {
  value: T;
  children: TreeNode<T>[] = [];

  constructor(value: T, children: TreeNode<T>[] | null = null) {
    this.value = value;
    this.children = children ?? [];
  }
}

export class locationMap<T extends TreeValue> {
  /**
   * Create a single location map entry
   */
  constructor(
    public indices: number[],
    public value: T,
  ) {}

  static getMapsIndices<T extends TreeValue>(
    maps: locationMap<T>[],
  ): Array<number[]> {
    return maps.map((map) => map.indices);
  }

  static doIndicesContain(
    indices: Array<number[]>,
    contain: number[],
  ): boolean {
    return indices.some(
      (innerArray) =>
        innerArray.length === contain.length &&
        innerArray.every((value, index) => value === contain[index]),
    );
  }

  static doIndicesContainStartingWith(
    indices: Array<number[]>,
    contain: number[],
  ): boolean {
    return indices.some((innerArray) =>
      JSON.stringify(innerArray).startsWith(
        JSON.stringify(contain).replace("]", ""),
      ),
    );
  }

  static areIndicesSubtreeOf(
    indices: Array<number[]>,
    contain: number[],
  ): boolean {
    return indices.some((innerArray) =>
      JSON.stringify(contain).startsWith(
        JSON.stringify(innerArray).replace("]", ""),
      ),
    );
  }
}

/**
 * A simple, bare-bones abstract interface for a tree.
 */
export abstract class Tree<T extends TreeValue> {
  root: TreeNode<T> | null = null;

  /**
   * Checks if the tree contains a value.
   *
   * Because any tree structure may be at play, we must preform a full tree search.
   *
   * Extenders of Tree<T> are free to optimize this function to their specific case
   * to achieve better runtime performance.
   *
   * @param value The value to check
   */
  contains(value: T): boolean {
    throw new Error("PENDING DEFAULT IMPLEMENTATION");
  }

  /**
   * Recursively finds the number of nodes in the tree.
   *
   * @returns Number of nodes
   */
  size(): number {
    if (this.root) return this.subtreeSize(this.root);
    else return 0;
  }
  /**
   * Recursively finds the number of nodes in the subtree.
   *
   * @param node Node to start from
   * @returns Number of nodes in subtree
   */
  subtreeSize(node: TreeNode<T>): number {
    let num = 1;
    for (let i = 0; i < node.children.length; i++) {
      num += this.subtreeSize(node.children[i]);
    }
    return num;
  }

  /**
   * Recursively finds the number of nodes in the tree, ignoring
   * subtrees where node.value.print() returns null.
   *
   * @returns Number of nodes
   */
  sizeNoNull(): number {
    if (this.root) return this.subtreeSizeNoNull(this.root);
    else return 0;
  }
  /**
   * Recursively finds the number of nodes in the subtree, ignoring
   * subtrees where node.value.print() returns null.
   *
   * @param node Node to start from
   * @returns Number of nodes in subtree
   */
  subtreeSizeNoNull(node: TreeNode<T>): number {
    if (node.value.print() === null) return 0;
    let num = 1;
    for (let i = 0; i < node.children.length; i++) {
      if (node.children[i].value.print() != null) {
        num += this.subtreeSizeNoNull(node.children[i]);
      }
    }
    return num;
  }

  /**
   * Throws all node values into a list via pre-order traversal.
   *
   * @returns A list representing the tree values
   */
  asList(): T[] {
    if (this.root) return this.recurseList(this.root);
    else return [];
  }
  private recurseList(node: TreeNode<T>): T[] {
    let arr: T[] = [];

    arr.push(node.value);

    for (let i = 0; i < node.children.length; i++) {
      arr = arr.concat(this.recurseList(node.children[i]));
    }

    return arr;
  }

  /**
   * Generates a list of all nodes,
   * matching an indexed path with it's value.
   *
   * E.g. in a simple binary tree, `[[0,0,1], SomeValue()]`
   * means the value is at left-left-right (`root.children[0].children[0].children[1]`).
   *
   * @returns A location map with corresponding values.
   */
  asLocationMap(): locationMap<T>[] {
    if (this.root) return this.recurseLocationMap(this.root);
    else return [];
  }
  private recurseLocationMap(
    node: TreeNode<T>,
    location: number[] = [],
  ): locationMap<T>[] {
    let arr: locationMap<T>[] = [];

    arr.push(new locationMap([...location], node.value));

    for (let i = 0; i < node.children.length; i++) {
      arr = arr.concat(
        this.recurseLocationMap(node.children[i], [...location, i]),
      );
    }

    return arr;
  }
}
