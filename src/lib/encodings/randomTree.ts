import { Tree, TreeNode, TreeValue } from "./tree";

export class RandomTreeValue extends TreeValue {
  level = 0;
  index = 0;

  print(): string {
    return `${this.level}|${this.index}`;
  }
  order(other: this): boolean {
    throw new Error("Method not implemented.");
  }
  equivalent(other: this): boolean {
    throw new Error("Method not implemented.");
  }
}

export class RandomTree extends Tree<RandomTreeValue> {
  build(max_children: number = 4, levels: number = 4): void {
    this.root = new TreeNode(new RandomTreeValue());
    this.buildRecurse(this.root, max_children, levels);
  }
  private buildRecurse(
    node: TreeNode<RandomTreeValue>,
    max_children: number = 4,
    levels: number = 4,
    level: number = 0,
  ) {
    node.value.level = level;
    if (levels === 0) return;

    let numChildren = Math.floor(Math.random() * (max_children + 1));

    for (let i = 0; i < numChildren; i++) {
      node.children.push(new TreeNode(new RandomTreeValue()));
      node.children[i].value.level = level + 1;
      node.children[i].value.index = i;
      this.buildRecurse(node.children[i], max_children, levels - 1, level + 1);
    }
  }
}
