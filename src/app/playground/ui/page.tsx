"use client";

import Aside from "@/components/Aside";
import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par } from "@/components/StyledSmalls";

export default function PlaygroundUI() {
  return (
    <StandardPageWrapper>
      <Heading>~ ✨ UI Testing ✨ ~</Heading>
      <hr />
      <Heading>tooltips</Heading>
      <hr />
      <Par>
        This is some text with a tooltip<Aside>hi</Aside> and some other text.
      </Par>
    </StandardPageWrapper>
  );
}
