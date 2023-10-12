"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par, StyledLink } from "@/components/StyledSmalls";

export default function Home() {
  return (
    <StandardPageWrapper>
      <Heading>Compression</Heading>
      <hr />
      <Par>(some intro blurb)</Par>
      <ul>
        <li>
          -{" "}
          <StyledLink href="/introduction">
            what is encoding and compression
          </StyledLink>
        </li>
        <li>
          - <StyledLink href="/huffman">huffman coding</StyledLink>
        </li>
        <li>
          - <StyledLink href="/playground">dev playground</StyledLink>
        </li>
        <li>
          - <StyledLink href="/attributions">attributions</StyledLink>
        </li>
      </ul>
    </StandardPageWrapper>
  );
}
