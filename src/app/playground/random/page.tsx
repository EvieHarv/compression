"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par } from "@/components/StyledSmalls";
import TreeVisualization from "@/components/mafs/TreeVisualization";
import { BREAKPOINTS } from "@/lib/constants";
import { RandomTree } from "@/lib/encodings/randomTree";
import { useWindowWidth } from "@react-hook/window-size";

export default function PlaygroundRandom() {
  const randomTree = new RandomTree();
  randomTree.build(3, 9);

  const screenWidth = useWindowWidth();

  return (
    <StandardPageWrapper>
      <Heading>~ ✨ Random Tree ✨ ~</Heading>
      <hr />
      <Par>(Refresh the page for a new one)</Par>
      <TreeVisualization
        tree={randomTree}
        rotate={screenWidth <= BREAKPOINTS.phone ? 90 : 0}
      />
    </StandardPageWrapper>
  );
}
