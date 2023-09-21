"use client";

import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading } from "@/components/StyledSmalls";
import { Mafs, Text, Polygon } from "mafs";

export default function Playground() {
  return (
    <StandardPageWrapper>
      <Heading>~ ✨ Dev Area ✨ ~</Heading>
      <hr />
      <Mafs pan={false} viewBox={{ x: [-5, 5], y: [-5, 5] }}>
        <Text x={0} y={0}>
          This is some text
        </Text>
        <Polygon
          points={[
            [-5, -5],
            [5, -5],
            [5, 5],
            [-5, 5],
          ]}
        />
      </Mafs>
    </StandardPageWrapper>
  );
}
