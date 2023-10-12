/**
 * Defines an abstract interface for binary trees.
 *
 * Primarily useful for implementing abstract interfaces over
 * a binary tree of an unknown type, such as the binary tree
 * visualziation component.
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
  abstract print(): string;

  /**
   * Orders the current instance with another instance of the same type.
   *
   * The method should return "true" if the current instance is greater
   * than the provided instance. Otherwise, it should return "false."
   *
   * Example:
   *
   * ```ts
   * const v1 = new MyValue(5);
   * const v2 = new MyValue(4);
   * v1.order(v2); // Returns true because 5 > 4
   * ```
   */
  abstract order(other: this): boolean;

  /**
   * Determines "equivalency" for determining if a tree contains a value.
   */
  abstract equivalent(other: this): boolean;
}

type NodePtr<T extends TreeValue> = TreeNode<T> | null;

/**
 * An individual node in a binary tree, with values of a certain type.
 */
export class TreeNode<T extends TreeValue> {
  value: T;
  left: NodePtr<T> = null;
  right: NodePtr<T> = null;

  constructor(value: T, left: NodePtr<T> = null, right: NodePtr<T> = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

/**
 * A simple, bare-bones abstract interface for a binary tree.
 */
export abstract class BTree<T extends TreeValue> {
  // TODO: Sparse methods for now, only implementing the needed parts as they come up.
  root: TreeNode<T> | null = null;

  insert(value: T): void {
    throw new Error("PENDING DEFAULT IMPLEMENTATION");
  }

  /**
   *
   * @param value Value to search for.
   */
  contains(value: T): void {
    throw new Error("PENDING DEFAULT IMPLEMENTATION");
  }
}
