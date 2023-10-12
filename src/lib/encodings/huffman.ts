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

type frequencyMap = { [key: string]: number };

/**
 * A simple implementation of a Huffman tree. Extends Tree from bintree interface.
 *
 * Includes methods for building the tree, encoding a string, and decoding a string.
 *
 * Example usage:
 *
 * ```ts
 * const tree = new HuffmanTree();
 * tree.buildFromString("hello world!");
 * const encoded = tree.encode("Hello, World!");
 * console.log(tree.decode(encoded)); // Hello, World!
 * ```
 */
export class HuffmanTree extends Tree<Huffman> {
  private buildFrequencyMap(input: string): frequencyMap {
    const map: frequencyMap = {};
    for (const char of input) {
      // Add or increment value, null coalescing
      map[char] = (map[char] ?? 0) + 1;
    }
    return map;
  }

  buildFromString(input: string): void {
    // Get the initial frequencies of the array.
    const freqMap = this.buildFrequencyMap(input);

    // We're just going to use a simple array for this priority queue.
    // A more complex example with a proper queue that implements indexed
    // inserts might be in order later, but for testing and initial purposes,
    // this should be more than servicable.
    // ---
    // Throw all the initial map values into the queue, Node-ifying them along the way.
    const queue: TreeNode<Huffman>[] = Object.keys(freqMap).map(
      (char) => new TreeNode<Huffman>(new Huffman(freqMap[char], char)),
    );

    while (queue.length > 1) {
      // Sort the queue by frequency
      // This is, of course, not the most efficient way to implement this.
      queue.sort((a, b) => a.value.count - b.value.count);

      // Pop out the two nodes with the smallest counts
      const left = queue.shift()!;
      const right = queue.shift()!;

      // Create a new node
      const newNode = new TreeNode<Huffman>(
        new Huffman(left.value.count + right.value.count),
        left,
        right,
      );

      // Push the new internal node back into the queue
      queue.push(newNode);
    }

    this.root = queue[0];
  }

  encode(input: string): string {
    throw new Error("Method Not Implemented");
  }

  decode(input: string): string {
    throw new Error("Method Not Implemented");
  }
}
