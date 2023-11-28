// styledComponents.js
import {
  COLORS,
  COLOR_CODES,
  FONT_SIZE,
  SPACINGS,
  SPACINGS_INT,
  WEIGHTS,
} from "@/lib/constants";
import Link from "next/link";
import styled from "styled-components";

export const Par = styled.p`
  margin: ${SPACINGS_INT.padding / 2}px 0px;
`;

export const Heading = styled.h1`
  font-weight: ${WEIGHTS.bold};
`;

export const StyledLink = styled(Link)`
  font-weight: ${WEIGHTS.bold};
  text-decoration: underline;
`;

export const ILCode = styled.code`
  display: inline-block;
  padding: ${SPACINGS_INT.padding / 8}px ${SPACINGS_INT.padding / 4}px;
  background-color: hsla(${COLOR_CODES.text}, 0.1);
  border: 1px solid ${COLORS.text};
  /* border-radius: 1px; */
`;

export const TWrap = styled.div`
  width: 100%;
  display: grid;
  place-content: center;

  margin: ${SPACINGS.padding} 0px;
`;

export const STable = styled.table`
  border: 1px solid ${COLORS.text};
  border-collapse: collapse;

  text-align: center;
`;

export const Th = styled.th`
  border: 1px solid ${COLORS.text};
  padding: ${SPACINGS_INT.padding / 2}px;
`;

export const Td = styled.td`
  border: 1px solid ${COLORS.text};
  padding: ${SPACINGS_INT.padding / 2}px;
`;

export const TextCenter = styled.div`
  text-align: center;
`;
