import { ReactNode } from "react";
import Header from "./Header";
import styled from "styled-components";
import { QUERIES, SPACINGS } from "@/lib/constants";

interface TextBoxProps {
  children?: ReactNode;
}

export default function StandardPageWrapper({ children }: TextBoxProps) {
  return (
    <Layout>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <ContentWrapper>{children}</ContentWrapper>
    </Layout>
  );
}

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 100ch 1fr;
  grid-template-areas:
    ". head ."
    ". content .";
  place-content: center;

  @media (${QUERIES.tabletAndSmaller}) {
    grid-template-columns: 0fr 1fr 0fr;
  }

  padding: ${SPACINGS.padding};
  gap: ${SPACINGS.padding};
`;

const HeaderWrapper = styled.div`
  grid-area: head;
`;

const ContentWrapper = styled.div`
  max-width: 100ch;
  grid-area: content;

  overflow-wrap: anywhere;
`;
