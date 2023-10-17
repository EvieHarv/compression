"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading } from "@/components/StyledSmalls";
import BoxBreakdown, { BoxBreakdownBox } from "@/components/mafs/BoxBreakdown";
import TreeVisualization from "@/components/mafs/TreeVisualization";
import StringToASCII from "@/lib/encodings/ascii";
import { HuffmanTree } from "@/lib/encodings/huffman";
import { useEffect, useState } from "react";

export default function Playground() {
  const [text, updateText] = useState("");

  const tree = new HuffmanTree();
  let encoded = tree.buildFromString(text);

  let asciiBoxes = text
    .split("")
    .map((char) => new BoxBreakdownBox(char, StringToASCII(char)));

  let huffmanBoxes = text
    .split("")
    .map((char) => new BoxBreakdownBox(char, tree.encode(char)));

  return (
    <StandardPageWrapper>
      <Heading>~ ✨ Dev Area ✨ ~</Heading>
      <hr />
      Text:{" "}
      <input
        type="text"
        value={text}
        onChange={(e) => updateText(e.target.value)}
      ></input>
      <Heading>ASCII</Heading>
      {StringToASCII(text).length} bits - {StringToASCII(text)}
      <BoxBreakdown input={asciiBoxes} />
      <hr />
      <Heading>Huffman</Heading>
      {encoded.length} bits - {encoded}
      <BoxBreakdown input={huffmanBoxes} />
      <Heading>Using tree</Heading>
      <TreeVisualization tree={tree} labelBranches={true} />
    </StandardPageWrapper>
  );
}
