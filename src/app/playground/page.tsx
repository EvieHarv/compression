"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading } from "@/components/StyledSmalls";
import AsciiBreakdown from "@/components/mafs/AsciiBreakdown";
import TreeVisualization from "@/components/mafs/TreeVisualization";
import StringToASCII from "@/lib/encodings/ascii";
import { HuffmanTree } from "@/lib/encodings/huffman";
import { useState } from "react";

export default function Playground() {
  const [text, updateText] = useState("");

  let ascii = StringToASCII(text);

  const tree = new HuffmanTree();
  let encoded = tree.buildFromString("hello world");
  console.log(tree);
  console.log(tree.decode(encoded));

  return (
    <StandardPageWrapper>
      <Heading>~ ✨ Dev Area ✨ ~</Heading>
      <hr />
      put text here:
      <input
        type="text"
        value={text}
        onChange={(e) => updateText(e.target.value)}
      ></input>
      <AsciiBreakdown input={text} />
      <Heading>visual break</Heading>
      <hr />
      <TreeVisualization tree={tree} labelBranches={true} />
    </StandardPageWrapper>
  );
}
