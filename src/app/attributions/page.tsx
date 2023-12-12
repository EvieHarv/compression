"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par } from "@/components/StyledSmalls";

export default function AttributionsPage() {
  return (
    <StandardPageWrapper>
      <Heading>Attributions</Heading>
      <hr />
      <Par>- built in nextjs</Par>
      <Par>- uses the wonderful library mafs</Par>
      <Par>- as well as react-tooltip</Par>
      <Par>- and regards to fabiensanglard.net for style "inspiration"</Par>
    </StandardPageWrapper>
  );
}
