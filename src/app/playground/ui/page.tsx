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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
        porttitor magna quis urna lobortis euismod. Nulla mauris ante, commodo
        et velit sed, scelerisque bibendum eros. Praesent vitae mauris neque.
        Curabitur semper lectus sit amet justo ultricies dapibus. Nulla sed
        felis eu ante consectetur malesuada. Maecenas feugiat pretium risus, ac
        tempus leo sodales et. Nullam eu risus eget mi egestas ornare eget sit
        amet nisi. Etiam
        <Aside>
          This is testing an aside in the middle of text, and additionally an
          aside with a decent bit of text inside of it.
        </Aside>{" "}
        ante lectus, bibendum vel magna et, elementum interdum lorem. Maecenas
        tempus, ligula eget volutpat mattis, risus odio pharetra urna, in congue
        sem felis tincidunt ipsum. Sed at risus luctus, commodo quam sit amet,
        commodo orci. Duis vitae libero urna. Class
        <Aside>
          This is testing an aside in the middle of text, and additionally an
          aside with a lot of text inside of it. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Curabitur porttitor magna quis urna
          lobortis euismod. Nulla mauris ante, commodo et velit sed, scelerisque
          bibendum eros. Praesent vitae mauris neque. Curabitur semper lectus
          sit amet justo ultricies dapibus. Nulla sed felis eu ante consectetur
          malesuada.
        </Aside>{" "}
        aptent taciti sociosqu ad litora torquent per conubia nostra, per
        inceptos himenaeos. In hac habitasse platea dictumst.
      </Par>
    </StandardPageWrapper>
  );
}
