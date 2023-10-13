"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par } from "@/components/StyledSmalls";

export default function AttributionsPage() {
  return (
    <StandardPageWrapper>
      <Heading>Attributions</Heading>
      <hr />
      <Par>- nextjs</Par>
      <Par>- mafs</Par>
      <Par>- fabiensanglard.net for style</Par>
    </StandardPageWrapper>
  );
}
