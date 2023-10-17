"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading } from "@/components/StyledSmalls";
import AsciiBreakdown from "@/components/mafs/AsciiBreakdown";
import TreeVisualization from "@/components/mafs/TreeVisualization";
import { HuffmanTree } from "@/lib/encodings/huffman";
import { useState } from "react";

export default function Playground() {
  const [text, updateText] = useState("");

  const tree = new HuffmanTree();
  let encoded = tree.buildFromString(text);

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
