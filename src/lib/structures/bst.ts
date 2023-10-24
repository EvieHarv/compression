import { TreeValue } from "./tree";

export class Bst extends TreeValue {
  /**
   * Create a simple BST value
   */
  constructor(public value: number) {
    super();
  }

  print(): string {
    return `${this.value}`;
  }
  order(other: this): boolean {
    throw new Error("Method not implemented.");
  }
  equivalent(other: this): boolean {
    throw new Error("Method not implemented.");
  }
}
