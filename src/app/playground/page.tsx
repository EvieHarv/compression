"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par, StyledLink } from "@/components/StyledSmalls";

export default function PlaygroundHome() {
  return (
    <StandardPageWrapper>
      <Heading>~ ✨ Dev Area ✨ ~</Heading>
      <hr />
      <Par>experiments:</Par>
      <ul>
        <li>
          -{" "}
          <StyledLink href="/playground/huffman">
            huffman coding interactive visual
          </StyledLink>
        </li>
        <li>
          - <StyledLink href="/playground/random">randomized tree</StyledLink>
        </li>
        <li>
          - <StyledLink href="/playground/bst">binary search tree</StyledLink>
        </li>
      </ul>
    </StandardPageWrapper>
  );
}
