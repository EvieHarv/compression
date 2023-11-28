"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par, StyledLink } from "@/components/StyledSmalls";

export default function Home() {
  return (
    <StandardPageWrapper>
      <Heading>Compression</Heading>
      <hr />
      <Par>
        This is a work in progress! I'm almost done with the "first section" of
        huffman coding, but essentially this site aims to just give an
        interactive and cool way of understanding different encodings.
      </Par>
      <Par>
        The thing I've been working on for most of the time has been the huffman
        coding example in the playground. It's surprisingly hard to render
        arbitrary n-ary trees nicely! See{" "}
        <StyledLink href="/playground/huffman">the experiment</StyledLink> and
        the{" "}
        <StyledLink href="https://github.com/EvieHarv/compression/blob/main/src/components/mafs/TreeVisualization.tsx">
          main code used in it
        </StyledLink>{" "}
        to know what I mean.
      </Par>
      <Par>
        So the site is pretty sparse, and what is here right now is very much
        just a draft, but feel free to look around anyways!
      </Par>
      <ul>
        <li>WIP articles</li>
        <li>
          -{" "}
          <StyledLink href="/introduction">
            what is encoding and compression
          </StyledLink>
        </li>
        <li>
          - <StyledLink href="/huffman">huffman coding</StyledLink>
        </li>
        <li>Dev stuff</li>
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
