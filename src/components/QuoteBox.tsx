import { FONT_SIZE, SPACINGS } from "@/lib/constants";
import { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children?: ReactNode;
}

export default function QuoteBox({ children }: Props) {
  return (
    <CenterWrap>
      <Box>{children}</Box>
    </CenterWrap>
  );
}

const CenterWrap = styled.div`
  display: grid;
  place-content: center;
  margin: ${SPACINGS.padding};
`;

const Box = styled.blockquote`
  padding: ${SPACINGS.padding};
  border: 2px solid;

  max-width: 80ch;
  font-size: ${FONT_SIZE.smaller};
`;
