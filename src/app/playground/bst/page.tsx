"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par } from "@/components/StyledSmalls";
import TreeVisualization from "@/components/mafs/TreeVisualization";
import { BREAKPOINTS, COLORS, SPACINGS_INT } from "@/lib/constants";
import { BST } from "@/lib/structures/bst";
import { useWindowWidth } from "@react-hook/window-size";
import { useMemo, useState } from "react";
import styled from "styled-components";

export default function PlaygroundBST() {
  const screenWidth = useWindowWidth();
  const [showBranches, setShowBranches] = useState(true);
  const [num, setNum] = useState(0);
  const [, rerender] = useState(false);

  // Very non-react way of doing it, but whatever.
  const tree = useMemo(() => new BST(), []);
  const doRerender = () => {
    rerender((e) => !e);
  };

  return (
    <StandardPageWrapper>
      <Heading>~ ✨ Random Tree ✨ ~</Heading>
      <hr />
      <Par>
        <Button onClick={() => setShowBranches((v) => !v)}>
          Toggle Null Branches
        </Button>
      </Par>
      <Par>
        Value:{" "}
        <input
          type="number"
          pattern="[0-9]*"
          min={0}
          value={num.toString()}
          onChange={(e) => setNum(Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              tree.insert(num);
              doRerender();
            }
            if (e.key === "Escape") {
              tree.remove(num);
              doRerender();
            }
          }}
        />
        <InlineButton
          onClick={() => {
            tree.insert(num);
            doRerender();
          }}
        >
          Insert (enter)
        </InlineButton>
        <InlineButton
          onClick={() => {
            tree.remove(num);
            doRerender();
          }}
        >
          Remove (esc)
        </InlineButton>
      </Par>
      <Par>Null Branches: {showBranches ? "Hidden" : "Shown"}</Par>
      <Par>Node Count: {tree.size()}</Par>
      <Par>Node Count (no null nodes): {tree.sizeNoNull()}</Par>
      <TreeVisualization
        tree={tree}
        rotate={screenWidth <= BREAKPOINTS.phone ? 90 : 0}
        hideNullBranches={showBranches}
      />
    </StandardPageWrapper>
  );
}

const Button = styled.button`
  margin: ${SPACINGS_INT.padding / 2}px 0px;
  padding: ${SPACINGS_INT.padding / 2}px;
  border: 1px solid ${COLORS.text};
`;

const InlineButton = styled.button`
  display: inline-block;
  padding: ${SPACINGS_INT.padding / 8}px ${SPACINGS_INT.padding / 2}px;
  margin-left: ${SPACINGS_INT.padding / 4}px;
  border: 1px solid ${COLORS.text};
`;
