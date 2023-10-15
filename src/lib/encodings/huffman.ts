import { Tree, TreeNode, TreeValue } from "./tree";

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
    return `${this.count}${this.char ? ` | "${this.char}"` : ""}`;
  }

  order(other: this) {
    return this.count > other.count;
  }

  equivalent(other: this): boolean {
    return this.count === other.count && this.char === other.char;
  }
}

type frequencyMap = { [key: string]: number };
type codeMap = { [key: string]: string };

/**
 * A simple implementation of a Huffman tree. Extends `Tree` from bintree interface.
 *
 * Includes additional methods for building the tree, encoding a string, and decoding a string.
 *
 * Note that the encoding of the input will be returned by buildFromString(), but then
 * you can encode any other string that uses the ***same characters*** via encode().
 *
 * Example usage:
 *
 * ```ts
 * const tree = new HuffmanTree();
 * const encoded = tree.buildFromString("hello world!");
 * const encoded_again = tree.encode("wow!!!!!"); // Not optimized!
 * console.log(tree.decode(encoded)); // hello world!
 * console.log(tree.decode(encoded_again)); // wow!!!!!
 * ```
 */
export class HuffmanTree extends Tree<Huffman> {
  // Caches codes.
  codes: codeMap = {};

  private buildFrequencyMap(input: string): frequencyMap {
    const map: frequencyMap = {};
    for (const char of input) {
      // Add or increment value, null coalescing
      map[char] = (map[char] ?? 0) + 1;
    }
    return map;
  }

  /**
   * Optimizes the tree to the specific input.
   *
   * @param input: String to optimize the tree to.
   * @returns The encoding of the input string.
   */
  buildFromString(input: string): string {
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
        [left, right],
      );

      // Push the new internal node back into the queue
      queue.push(newNode);
    }

    // Append root, and cache the codes.
    this.root = queue[0];
    this.generateCodes(this.root, "");

    return this.encode(input);
  }

  // Recursively generate codes, storing them in self.codes
  private generateCodes(node: TreeNode<Huffman> | null, code: string): void {
    if (!node) return;

    if (node.value.char && node.value.char !== "") {
      this.codes[node.value.char] = code;
    }

    // Recurse left
    this.generateCodes(node.children[0], code + "0");
    // Recurse right
    this.generateCodes(node.children[1], code + "1");
  }

  /**
   * Encodes a string using the current layout of the tree.
   * If a character is requested to be encoded that does not
   * exist in the tree, an error will be thrown.
   *
   * @param input String to encode.
   * @returns A string-encoded binary sequence.
   */
  encode(input: string): string {
    // Utilizing the cached value `this.codes`, trivially assign values.
    // This is okay, as we assume that a tree is built before encoding,

    let encoded = "";
    for (const char of input) {
      if (this.codes[char] == undefined)
        throw new Error("Code not found, please rebuild tree!");
      encoded += this.codes[char];
    }
    return encoded;
  }

  /**
   * Converts an encoded bit string back into text.
   *
   * @param input A string-encoded binary sequence.
   * @returns The decoded string.
   */
  decode(input: string): string {
    // Even though we could simply use the cached codes, it's more
    // interesting/illustrative/fun to actually traverse the tree
    // like how God intended 🙏.

    let decoded = "";
    let currentNode = this.root;

    for (const bit of input) {
      // Traverse left or right
      if (bit == "0") {
        currentNode = currentNode!.children[0];
      } else {
        currentNode = currentNode!.children[1];
      }

      // Char found! Append, and reset back to root.
      if (currentNode!.value.char) {
        decoded += currentNode!.value.char;
        currentNode = this.root;
      }
    }

    return decoded;
  }
}
