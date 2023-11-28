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
  TextCenter,
  Th,
} from "@/components/StyledSmalls";
import BoxBreakdown, { BoxBreakdownBox } from "@/components/mafs/BoxBreakdown";
import { StringToASCII } from "@/lib/structures/ascii";
import { useEffect, useState } from "react";

export default function IntroductionPage() {
  const defaultText = "aaAH! computers!";
  const [text, updateText] = useState<string | null>(null);

  // It would be more efficient to wrap all of this into an effect or memo,
  // but it's so low impact I'll ignore that.
  let asciiBoxes: BoxBreakdownBox[] = [];

  if (text)
    asciiBoxes = text
      .split("")
      .map((char) => new BoxBreakdownBox(char, StringToASCII(char)));

  useEffect(() => {
    console.log("yea");
    updateText(defaultText);
  }, []);

  return (
    <StandardPageWrapper>
      <Heading>ASCII</Heading>
      <hr />
      <Par>
        Imagine you have some text that you want inside ~a computer~, such as
        the following:
      </Par>
      <QuoteBox>{text === null ? defaultText : text}</QuoteBox>
      <Par>
        This is complicated by the fact that computers aren't very smart and
        don't know what letters are.
      </Par>
      <br />
      <Par>
        All digital information must eventually be stored as a series of{" "}
        <ILCode>0</ILCode>s and <ILCode>1</ILCode>s. This is known as binary,
        with each <ILCode>0</ILCode> or <ILCode>1</ILCode> being a "bit." In
        order to store and display text, we have to somehow convert all of our
        complicated human symbols into binary.
      </Par>
      <Par>
        We call this process <i>encoding</i>. Roughly, we may say encoding is
        "taking information stored in one format, and turning it into another."
        There are essentially an infinite number of ways to do that, and
        computer scientists spend a lot of time arguing about them.
      </Par>
      <br />
      <Par>
        It's important to recognize that there's a somewhat fundamental obstacle
        with representing things in binary—there are no spaces to separate
        things! Say for instance you started writing out the alphabet like this,
        counting up in binary:
      </Par>
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
              <Td>a</Td>
              <Td>0</Td>
            </tr>
            <tr>
              <Td>b</Td>
              <Td>1</Td>
            </tr>
            <tr>
              <Td>c</Td>
              <Td>10</Td>
            </tr>
            <tr>
              <Td>...</Td>
              <Td>...</Td>
            </tr>
          </tbody>
        </STable>
      </TWrap>
      <Par>
        This starts to work, for instance if we just see a <ILCode>1</ILCode>{" "}
        that's clearly <ILCode>b</ILCode>, and just a <ILCode>0</ILCode> is{" "}
        <ILCode>a</ILCode>, but what about <ILCode>10</ILCode>? Does that mean{" "}
        <ILCode>ba</ILCode> or <ILCode>c</ILCode>? We aren't allowed to do
        something like <ILCode>1 0 10 = bac</ILCode>, it has to all be in one
        long line like <ILCode>1010</ILCode>.
      </Par>
      <br />
      <Par>
        This introduces us to two fundamental questions any text encoding must
        answer:
      </Par>
      <ul>
        <li>- Can I represent every letter uniquely?</li>
        <li>- Can I tell where one letter ends and another begins?</li>
      </ul>
      <br />
      <Par>
        <i>ASCII</i>
        <Aside>"American Standard Code for Information Interchange"</Aside> is a
        simple and widely recognized English text
        <Aside>Latin Alphabet, really.</Aside> encoding that fits these
        requirements. It's old and has some historic quirks, but for now we'll
        pretend it's perfect.
      </Par>
      <Par>
        It solves our problem in the most straightforward way: just make
        everything the exact same size. It turns out that if we use 7 bits per
        character, we can represent all uppercase and lowercase letters, along
        with some important extras like spaces, punctuation, and special
        characters.
      </Par>
      <Par>
        For ~computer science reasons~
        <Aside>
          We like when things are aligned to powers of 2, because it's easy to
          represent powers of 2 in binary.
        </Aside>
        , we usually add another <ILCode>0</ILCode> to the beginning to bring
        this up to a nice even 8 bits. So, to find where one letter begins and
        another ends in our long string of binary, we can simply go forward and
        backward 8 bits and we'll always land on a clean boundary.
      </Par>
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
              <Td>a</Td>
              <Td>01100001</Td>
            </tr>
            <tr>
              <Td>b</Td>
              <Td>01100010</Td>
            </tr>
            <tr>
              <Td>c</Td>
              <Td>01100011</Td>
            </tr>
            <tr>
              <Td>...</Td>
              <Td>...</Td>
            </tr>
          </tbody>
        </STable>
      </TWrap>
      <Par>So, using ASCII, our text from earlier becomes: </Par>
      <QuoteBox>
        <TextCenter>
          {text}
          <br />=<br />
          <ILCode>
            {StringToASCII(text ?? "") === ""
              ? "\u200B"
              : StringToASCII(text ?? "")}
          </ILCode>{" "}
        </TextCenter>
      </QuoteBox>
      <Par>or written out a little more clearly,</Par>
      <BoxBreakdown input={asciiBoxes} />
      <Par>
        That's it! We've successfully taken some text and converted it to binary
        using ASCII encoding. You're now ready to move on to{" "}
        <StyledLink href="/huffman">Huffman Coding</StyledLink>, which packs
        everything a bit tighter. You can also play around with ASCII by
        changing the text displayed above:
      </Par>
      <input
        type="text"
        value={text ?? ""}
        onChange={(e) => updateText(e.target.value)}
      ></input>
    </StandardPageWrapper>
  );
}
