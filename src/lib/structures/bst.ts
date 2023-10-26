import { Tree, TreeNode, TreeValue } from "./tree";

export class BstVal extends TreeValue {
  /**
   * Create a simple BST value
   * @param value Number or null
   */
  constructor(public num: number | null) {
    super();
  }

  static nullNode(): TreeNode<BstVal> {
    return new TreeNode(new BstVal(null));
  }

  static nodeFrom(val: number): TreeNode<BstVal> {
    return new TreeNode(new BstVal(val), [this.nullNode(), this.nullNode()]);
  }

  print(): string | null {
    if (this.num === null) {
      return null;
    }
    return `${this.num}`;
  }

  equivalent(other: this): boolean {
    throw new Error("Method not implemented.");
  }
}

export class BST extends Tree<BstVal> {
  /**
   *
   * @param shiftSubtree
   */
  constructor(public shiftSubtree: boolean = false) {
    super();
  }

  /**
   * Inserts a new value into the tree in the correct position.
   *
   * Duplicates are ignored.
   *
   * @param val Number to insert
   */
  insert(val: number) {
    if (this.root) this.root = this.recurseInsert(this.root, val);
    else this.root = BstVal.nodeFrom(val);
  }
  private recurseInsert(node: TreeNode<BstVal>, val: number): TreeNode<BstVal> {
    if (node.value.num === null) {
      return BstVal.nodeFrom(val);
    } else if (val > node.value.num) {
      node.children[1] = this.recurseInsert(node.children[1], val);
    } else if (val < node.value.num) {
      node.children[0] = this.recurseInsert(node.children[0], val);
    }
    return node;
  }

  /**
   * Removes a value, pulling up
   *
   * @param val Number to remove
   */
  remove(val: number) {
    if (this.root) this.root = this.recurseRemove(this.root, val);
  }
  private recurseRemove(node: TreeNode<BstVal>, val: number): TreeNode<BstVal> {
    if (node.value.num === null) {
      return BstVal.nullNode();
    } else if (node.value.num === val) {
      if (node.children[0].value.num === null) return node.children[1];

      let rightmost = node.children[0];
      while (rightmost.children[1]?.value.num) {
        rightmost = rightmost.children[1];
      }
      rightmost.children[1] = node.children[1];
      return node.children[0];
    } else if (val > node.value.num) {
      node.children[1] = this.recurseRemove(node.children[1], val);
    } else if (val < node.value.num) {
      node.children[0] = this.recurseRemove(node.children[0], val);
    }
    return node;
  }
}
