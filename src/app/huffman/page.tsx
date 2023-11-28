"use client";

import Aside from "@/components/Aside";
import QuoteBox from "@/components/QuoteBox";
import StandardPageWrapper from "@/components/StandardPageWrapper";
import {
  Heading,
  ILCode,
  Par,
  STable,
  StyledLink,
  TWrap,
  Td,
  Th,
} from "@/components/StyledSmalls";
import BoxBreakdown, { BoxBreakdownBox } from "@/components/mafs/BoxBreakdown";
import { HuffmanTree } from "@/lib/structures/huffman";
import { useEffect, useState } from "react";

export default function HuffmanPage() {
  const defaultText = "this is some wacky text to compress with 9 spaces";
  const [text, updateText] = useState<string | null>(null);

  // It would be more efficient to wrap all of this into an effect or memo,
  // but it's so low impact I'll ignore that.
  let asciiBoxes: BoxBreakdownBox[] = [];

  if (text) {
    // Create all boxes
    asciiBoxes = Object.entries(HuffmanTree.buildFrequencyMap(text)).map(
      (entry) => new BoxBreakdownBox(entry[0], entry[1].toString()),
    );

    // Sort them by largest number
    asciiBoxes.sort((a, b) => Number(b.belowText) - Number(a.belowText));

    //
    asciiBoxes.splice(3, asciiBoxes.length);

    asciiBoxes.push(new BoxBreakdownBox("⋯", "etc."));
  }

  useEffect(() => {
    console.log("yea");
    updateText(defaultText);
  }, []);

  return (
    <StandardPageWrapper>
      <Heading>Huffman Coding</Heading>
      <hr />
      <Par>
        In much of computing, we run up against a very practical problem: the
        complicated devices we use to store digital information are expensive.
        We prefer to live in the world of the theoretical as much as possible,
        but eventually accounting has to have a say in how our programs work.
      </Par>
      <QuoteBox>
        At some point every developer learns that the hardest thing in computer
        science has nothing to do with programming, and everything to do with
        avoiding getting killed by an angry finance department.
      </QuoteBox>
      <Par>
        So, say we're trying to store a ton of text. We may at first reach for
        some of the encodings we've used before, such as{" "}
        <StyledLink href="/ascii">ASCII</StyledLink>, UTF-8
        <Aside>
          I might eventually write an article for UTF-8, it's a fun and very
          important encoding.
        </Aside>
        , etc. These are <i>fine</i>, but they may eventually make accounting
        rather mad at us—they take up way too much space!
      </Par>
      <Par>
        Let's just focus on ASCII for now. Every single time we have to store a
        character, we're taking up a whole 8 bits
        <Aside>
          If you squished it down, you could remove the leading zero and be be
          left with 7 bits, but that's still not amazing. I'm just gonna pretend
          we need the full 8 for simplicity.
        </Aside>
        ! That may not sound like a <i>ton</i>, but with enough text it becomes
        rather huge.
      </Par>
      <Par>
        Wouldn't it be nice if we could make things smaller? We've already seen
        that if we make every character the same size, we <i>have</i> to use our
        same 8 bits just to fit all the symbols we need. So, things are going to
        have to be different sizes.
      </Par>
      <Par>
        Thinking about it for awhile, we may realize that we use the letter{" "}
        <ILCode>e</ILCode> rather often, but <ILCode>Z</ILCode> is rather
        uncommon—why can't we "steal" some size off of one and give it to the
        other? Our code for <ILCode>Z</ILCode> can be a good bit longer, and as
        long as that lets us make <ILCode>e</ILCode> pretty short, we'll save
        space overall!
      </Par>
      <QuoteBox>
        <TWrap>
          <STable>
            <thead>
              <tr>
                <Th>Letter</Th>
                <Th>Code</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>e</Td>
                <Td>0</Td>
              </tr>
              <tr>
                <Td>z</Td>
                <Td>110100101110101</Td>
              </tr>
            </tbody>
          </STable>
        </TWrap>
        (Maybe not quite this intense)
      </QuoteBox>
      <Par>So, we now have two new problems:</Par>
      <ul>
        <li>
          - If things are different sizes, how do we know where one character
          starts and another ends?
        </li>
        <li>
          - How do we figure out which letters to make longer and shorter, and
          by how much?
        </li>
      </ul>
      <br />
      <Par>
        You may also realize pretty quickly that this is going to be different
        for different text. An article about pizza is going to have a ton of{" "}
        <ILCode>z</ILCode>'s, so we can't universally say that{" "}
        <ILCode>z</ILCode> isn't used often
        <Aside>
          Well, you <i>could</i>, but you'd have to accept being wrong
          sometimes, which is not something engineers enjoy.
        </Aside>
        .
      </Par>
      <br />
      <Heading>How do we do that?</Heading>
      <hr />
      <Par>
        This is a pretty complex problem! Luckily for us, we have an elegant
        solution already given to us in a 1952 MIT paper by David A. Huffman
        <Aside>
          "A Method for the Construction of Minimum-Redundancy Codes"
        </Aside>
        .
      </Par>
      <Par>
        We start by taking some block of text we want to encode, such as:
      </Par>
      <QuoteBox>{text}</QuoteBox>
      <Par>
        Our first step is to count characters, and see how often each one shows
        up:
      </Par>
      <BoxBreakdown input={asciiBoxes} />
      <hr />
      <Par>TODO: finish lol</Par>
    </StandardPageWrapper>
  );
}
