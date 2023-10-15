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

// Syntactic sugar
type NodePtr<T extends TreeValue> = TreeNode<T>;

/**
 * An individual node in a tree, with values of a certain type.
 */
export class TreeNode<T extends TreeValue> {
  value: T;
  children: NodePtr<T>[] = [];

  constructor(value: T, children: NodePtr<T>[] | null = null) {
    this.value = value;
    this.children = children ?? [];
  }
}

type locationMap<T extends TreeValue> = [string, T];

/**
 * A simple, bare-bones abstract interface for a tree.
 */
export abstract class Tree<T extends TreeValue> {
  root: TreeNode<T> | null = null;

  // TODO: Sparse methods for now, only implementing the needed parts as they come up.
  // For now, this class mainly serves as simply "something that can hold a root of TreeNode<T>"
  insert(value: T): void {
    throw new Error("PENDING DEFAULT IMPLEMENTATION");
  }

  contains(value: T): void {
    throw new Error("PENDING DEFAULT IMPLEMENTATION");
  }

  asList(): T[] {
    if (this.root) return this.recurseList(this.root);
    return [];
  }
  private recurseList(node: TreeNode<T>): T[] {
    let arr: T[] = [];

    arr.push(node.value);

    for (let i = 0; i < node.children.length; i++) {
      arr = arr.concat(this.recurseList(node.children[i]));
    }

    return arr;
  }

  asLocationMap(): locationMap<T>[] {
    if (this.root) return this.recurseLocationMap(this.root);
    return [];
  }
  private recurseLocationMap(
    node: TreeNode<T>,
    location: string = "",
  ): locationMap<T>[] {
    let arr: locationMap<T>[] = [];

    arr.push([location, node.value]);

    for (let i = 0; i < node.children.length; i++) {
      arr = arr.concat(
        this.recurseLocationMap(node.children[i], location + i.toString()),
      );
    }

    return arr;
  }
}
