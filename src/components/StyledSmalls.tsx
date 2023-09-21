// styledComponents.js
import { FONT_SIZE, WEIGHTS } from "@/lib/constants";
import Link from "next/link";
import styled from "styled-components";

export const Par = styled.p``;

export const Heading = styled.h1`
  font-weight: ${WEIGHTS.bold};
`;

export const StyledLink = styled(Link)`
  font-weight: ${WEIGHTS.bold};
  text-decoration: underline;
`;
