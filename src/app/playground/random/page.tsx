"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par } from "@/components/StyledSmalls";
import TreeVisualization from "@/components/mafs/TreeVisualization";
import { BREAKPOINTS, COLORS, SPACINGS, SPACINGS_INT } from "@/lib/constants";
import { RandomTree } from "@/lib/structures/randomTree";
import { useWindowWidth } from "@react-hook/window-size";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

export default function PlaygroundRandom() {
  const screenWidth = useWindowWidth();
  const [maxChildren, setMaxChildren] = useState(3);
  const [maxLevels, setMaxLevels] = useState(6);
  const [seed, setSeed] = useState(22321422);

  const [randomTree, setRandomTree] = useState<RandomTree | null>(null);

  useEffect(() => {
    const newRandomTree = new RandomTree(maxChildren, maxLevels, seed * 127);
    setRandomTree(newRandomTree);
  }, [maxChildren, maxLevels, seed]);

  const validate = (val: string): number => {
    let num: number = Number(val.replace(/^0+/, ""));
    num = Math.max(num, 0);
    num = Math.min(num, 10);
    return num;
  };

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
          value={maxChildren.toString()}
          onChange={(e) => setMaxChildren(validate(e.target.value))}
        />
      </Par>
      <Par>
        Max Levels:{" "}
        <input
          type="number"
          pattern="[0-9]*"
          min={0}
          max={10}
          value={maxLevels.toString()}
          onChange={(e) => setMaxLevels(validate(e.target.value))}
        />
      </Par>
      <Par>
        Seed:{" "}
        <input
          type="number"
          pattern="[0-9]*"
          min={0}
          value={seed.toString()}
          onChange={(e) => setSeed(Number(e.target.value))}
        />
      </Par>
      <Par>
        <Button
          onClick={() => setSeed(Math.floor(Math.random() * 472313222387))}
        >
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
