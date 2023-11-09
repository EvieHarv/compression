"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, ILCode } from "@/components/StyledSmalls";
import BoxBreakdown, { BoxBreakdownBox } from "@/components/mafs/BoxBreakdown";
import TreeVisualization from "@/components/mafs/TreeVisualization";
import { BREAKPOINTS } from "@/lib/constants";
import { StringToASCII } from "@/lib/structures/ascii";
import { HuffmanTree } from "@/lib/structures/huffman";
import { locationMap } from "@/lib/structures/tree";
import { useWindowWidth } from "@react-hook/window-size";
import { useState } from "react";

export default function PlaygroundHuffman() {
  const [text, updateText] = useState("");

  const tree = new HuffmanTree();
  let encoded = tree.buildFromString(text);

  let asciiBoxes = text
    .split("")
    .map((char) => new BoxBreakdownBox(char, StringToASCII(char)));

  let huffmanBoxes = text
    .split("")
    .map((char) => new BoxBreakdownBox(char, tree.encode(char)));

  const screenWidth = useWindowWidth();

  const h_location = locationMap.getMapsIndices(
    tree.asLocationMap().filter((a) => a.value.char === "h"),
  );

  const e_location = locationMap.getMapsIndices(
    tree.asLocationMap().filter((a) => a.value.char === "e"),
  );

  return (
    <StandardPageWrapper>
      <Heading>~ ✨ Huffman Coding Example ✨ ~</Heading>
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
      <Heading>
        Using tree (for testing, highlighting the path to "h" if it exists,
        highlighting individual "e" node if it exists, and highlighting the
        whole subtree starting at [1, 1, 0] if it exists) (try the string{" "}
        <ILCode>32_Qz3wxt4eryctuvyibuhbki</ILCode> for a good example)
      </Heading>
      <TreeVisualization
        tree={tree}
        rotate={screenWidth <= BREAKPOINTS.phone ? 90 : 0}
        labelBranches={true}
        highlightLeaves={false}
        highlightSubtrees={[[1, 1, 0]]} // Should highlight right side
        highlightPaths={h_location}
        highlightNodes={e_location}
      />
    </StandardPageWrapper>
  );
}
