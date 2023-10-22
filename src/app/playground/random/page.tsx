"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par } from "@/components/StyledSmalls";
import TreeVisualization from "@/components/mafs/TreeVisualization";
import { BREAKPOINTS, COLORS, SPACINGS, SPACINGS_INT } from "@/lib/constants";
import { RandomTree } from "@/lib/encodings/randomTree";
import { useWindowWidth } from "@react-hook/window-size";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

export default function PlaygroundRandom() {
  const screenWidth = useWindowWidth();
  const [maxChildren, setMaxChildren] = useState(3);
  const [maxLevels, setMaxLevels] = useState(9);
  const [buttonPressed, setButtonPressed] = useState(0);

  const [randomTree, setRandomTree] = useState<any>(null);

  useEffect(() => {
    // This part will only run on the client, avoiding the hydration issue.
    const newRandomTree = new RandomTree(maxChildren, maxLevels);
    setRandomTree(newRandomTree);
  }, [maxChildren, maxLevels, buttonPressed]);

  return (
    <StandardPageWrapper>
      <Heading>~ ✨ Random Tree ✨ ~</Heading>
      <hr />
      <Par>
        Max Children:{" "}
        <input
          type="number"
          pattern="[0-9]*"
          min={0}
          max={10}
          value={maxChildren}
          onChange={(e) => setMaxChildren(Number(e.target.value))}
        />
      </Par>
      <Par>
        Max Levels:{" "}
        <input
          type="number"
          pattern="[0-9]*"
          min={0}
          max={10}
          value={maxLevels}
          onChange={(e) => setMaxLevels(Number(e.target.value))}
        />
      </Par>
      <Par>
        <Button onClick={() => setButtonPressed((val) => val + 1)}>
          Generate New
        </Button>
      </Par>
      <hr />
      {randomTree ? (
        <>
          <Par>Node Count: {randomTree.size()}</Par>
          <TreeVisualization
            tree={randomTree}
            rotate={screenWidth <= BREAKPOINTS.phone ? 90 : 0}
          />
        </>
      ) : (
        <>Loading...</>
      )}
    </StandardPageWrapper>
  );
}

const Button = styled.button`
  margin-top: ${SPACINGS_INT.padding / 2}px;
  padding: ${SPACINGS_INT.padding / 2}px;
  border: 1px solid ${COLORS.text};
`;
