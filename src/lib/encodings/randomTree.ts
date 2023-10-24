import { Tree, TreeNode, TreeValue } from "./tree";

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // LCG parameters
  private readonly a: number = 1664525;
  private readonly c: number = 1013904223;
  private readonly m: number = Math.pow(2, 32);

  // Generate a random float [0, 1)
  public nextFloat(): number {
    this.seed = (this.a * this.seed + this.c) % this.m;
    return this.seed / this.m;
  }

  // Generate a random integer [min, max]
  public nextInt(min: number, max: number): number {
    return min + Math.floor(this.nextFloat() * (max - min + 1));
  }
}

export class RandomTreeValue extends TreeValue {
  index = 0;

  print(): string {
    return "";
    // return `${this.level}|${this.index}`;
  }
  order(other: this): boolean {
    throw new Error("Method not implemented.");
  }
  equivalent(other: this): boolean {
    throw new Error("Method not implemented.");
  }
}

export class RandomTree extends Tree<RandomTreeValue> {
  /**
   * Builds a new random tree
   */
  constructor(max_children: number = 4, levels: number = 4, seed: number) {
    super();
    this.build(max_children, levels, seed);
  }

  build(max_children: number = 4, levels: number = 4, seed: number): void {
    this.root = new TreeNode(new RandomTreeValue());
    this.buildRecurse(this.root, max_children, levels, seed);
  }
  private buildRecurse(
    node: TreeNode<RandomTreeValue>,
    max_children: number = 4,
    levels: number = 4,
    seed: number = 0,
  ) {
    if (levels === 0) return;

    const rng = new SeededRandom(seed);

    let numChildren = rng.nextInt(0, max_children);

    for (let i = 0; i < numChildren; i++) {
      node.children.push(new TreeNode(new RandomTreeValue()));
      node.children[i].value.index = i;
      this.buildRecurse(
        node.children[i],
        max_children,
        levels - 1,
        rng.nextInt(0, seed) + i * 33601 + levels * 924773,
      );
    }
  }
}
