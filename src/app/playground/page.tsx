"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading } from "@/components/StyledSmalls";
import TextBreakdown from "@/components/mafs/AsciiBreakdown";
import { HuffmanTree } from "@/lib/encodings/huffman";
import { useState } from "react";

export default function Playground() {
  const [text, updateText] = useState("");

  const tree = new HuffmanTree();
  tree.buildFromString("hello world!");
  console.log(tree);

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
      <TextBreakdown input={text} />
    </StandardPageWrapper>
  );
}
