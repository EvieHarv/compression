import { BTree, TreeValue } from "@/lib/encodings/btree";

interface Props<U extends TreeValue, T extends BTree<U>> {
  tree: T;
}

export default function BTreeBreakdown<
  U extends TreeValue,
  T extends BTree<U>,
>({ tree }: Props<U, T>) {
  return <div>{tree.root?.value.print()}</div>;
}
