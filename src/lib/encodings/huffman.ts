import { Tree, TreeNode, TreeValue } from "./bintree";

export class Huffman extends TreeValue {
  count: number = 0;
  char?: string | undefined;

  /**
   * Constructs a new Huffman value.
   */
  constructor(count: number, char?: string) {
    super();
    this.count = count;
    this.char = char;
  }

  print(): string {
    return `${this.count}${this.char ? ` | ${this.char}` : ""}`;
  }
  compare(other: Huffman) {
    return this.count > other.count;
  }
}

export class HuffmanTree extends Tree<Huffman> {
  // We literally only ever need one insert, so we can safely override this.
  insert(value: Huffman): void {
    this.root = new TreeNode<Huffman>(value);
  }

  combine(other: HuffmanTree): HuffmanTree {
    throw new Error("Method not implemented.");
  }

  buildEncoding(input: string): HuffmanTree {
    // TODO: Implement a priority queue
    throw new Error("Method not implemented.");
  }
}
