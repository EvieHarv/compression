"use client";

import { COLORS, WEIGHTS } from "@/lib/constants";
import { ReactNode, useId } from "react";
import { Tooltip } from "react-tooltip";
import styled from "styled-components";

interface Props {
  children?: ReactNode;
  marker?: ReactNode;
}

export default function Aside({
  children,
  marker = <AstriskStyle>*</AstriskStyle>,
}: Props) {
  const id = useId();

  return (
    <Span>
      <a data-tooltip-id={id}>{marker}</a>
      <Tooltip id={id}>{children}</Tooltip>
    </Span>
  );
}

const Span = styled.span`
  display: inline-block;
  margin-right: 2px;
`;

const AstriskStyle = styled.span`
  color: ${COLORS.primary};
  font-weight: ${WEIGHTS.bold};
`;
