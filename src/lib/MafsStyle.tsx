"use client";

import { createGlobalStyle } from "styled-components";
import { COLORS } from "./constants";

const MafsStyle = createGlobalStyle`
  .MafsView {
    --mafs-bg: ${COLORS.background};
    --mafs-fg: ${COLORS.text};
  }
`;

export default MafsStyle;
