"use client";

import { COLORS, FONT_SIZE, WEIGHTS } from "@/lib/constants";
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
      <Tooltip id={id}>
        <DefaultContentWrapper>{children}</DefaultContentWrapper>
      </Tooltip>
    </Span>
  );
}

const Span = styled.span`
  display: inline;
  margin-right: 2px;
`;

const AstriskStyle = styled.span`
  color: ${COLORS.primary};
  font-weight: ${WEIGHTS.bold};
  display: inline;
  transform: translateY(-5px);
`;

const DefaultContentWrapper = styled.p`
  max-width: 35ch;
`;
