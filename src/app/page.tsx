"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par, StyledLink } from "@/components/StyledSmalls";

export default function Home() {
  return (
    <StandardPageWrapper>
      <Heading>Compression</Heading>
      <hr />
      <Par>
        This site aims to give an interactive and fun way of understanding
        different encodings. It's a massive work in progress, but there's still
        some stuff of interest lying around!
      </Par>
      <br />
      <ul>
        <li>Currently, the following articles are available:</li>
        <li>
          -{" "}
          <StyledLink href="/introduction">
            Introducing ASCII - What is Encoding and Compression?
          </StyledLink>
        </li>
        <li>
          - <StyledLink href="/huffman">Huffman Coding</StyledLink>
        </li>
      </ul>
      <br />
      <Par>
        Its fairly sparse still, but I want to add more to it over time! There
        are some other fun things hidden in the dev areas, so feel free to poke
        around
      </Par>
      <Par>
        <StyledLink href="/playground">dev playground</StyledLink>
      </Par>
      <Par>
        <StyledLink href="/attributions">attributions</StyledLink>
      </Par>
    </StandardPageWrapper>
  );
}
