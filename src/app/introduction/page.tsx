"use client";

import Aside from "@/components/Aside";
import QuoteBox from "@/components/QuoteBox";
import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par } from "@/components/StyledSmalls";

export default function IntroductionPage() {
  return (
    <StandardPageWrapper>
      <Heading>ASCII</Heading>
      <hr />
      <Par>
        Imagine you have some text that you want inside ~a computer~, such as
        the following:
      </Par>
      <QuoteBox>
        (TODO: choose something vaguely funny but not distracting)
        <Par>candidates:</Par>
        <ul>
          <li>- as per my last email, no.</li>
          <li>- oh boy this is some beautiful text</li>
          <li>- the following</li>
          <li>- i read this article, and all i got was this stupid quote</li>
          <li>
            - we've been trying to reach you about your car's extended warranty
          </li>
          <li>
            - we've been trying to reach you about your text's extended warranty
          </li>
          <li>- hi computer!</li>
          <li>
            - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Suspendisse, iaculis quis help I am stuck in a word factory
            tincidunt fringilla. Sed congue massa commodo ex blandit, nec auctor
            ipsum ultrices.
          </li>
        </ul>
      </QuoteBox>
      <Par>
        This is complicated by the fact that computers don't know what a word or
        a letter is.
      </Par>
      <br />
      <Par>
        As you may have heard, all digital information is stored as a series of
        0s and 1s (known as binary). In order to store and display text on a
        computer, we have to somehow convert all of our complicated letters and
        symbols into binary.
      </Par>
      <Par>
        We call this process <i>encoding</i>. At a base level, we may roughly
        say encoding is "taking information stored in one format, and turning it
        into another." There are essentially an infinite number of ways to do
        that, and computer scientists absolutely love to argue about them.
      </Par>
      <br />
      <Par>
        For standard, basic English text, ASCII
        <Aside>American Standard Code for Information Interchange</Aside> is a
        widely recognized and important encoding. It's mainly important for
        historical reasons and certainly has its quirks, but we'll pretend it's
        perfect for now.
      </Par>
      <Par>
        A benefit of ASCII is its pure <i>simplicity</i>.
      </Par>
    </StandardPageWrapper>
  );
}
