"use client";

import QuoteBox from "@/components/QuoteBox";
import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par, StyledLink } from "@/components/StyledSmalls";

export default function HuffmanPage() {
  return (
    <StandardPageWrapper>
      <Par>~ explain huffman coding ~</Par>
      <Par>
        use{" "}
        <StyledLink href="/playground/huffman">
          smtn like this playground experiemnt
        </StyledLink>
      </Par>
    </StandardPageWrapper>
  );
}
