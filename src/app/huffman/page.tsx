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
import TreeVisualization from "@/components/mafs/TreeVisualization";
import { BREAKPOINTS } from "@/lib/constants";
import { StringToASCII } from "@/lib/structures/ascii";
import { HuffmanTree } from "@/lib/structures/huffman";
import { useWindowWidth } from "@react-hook/window-size";
import { useEffect, useState } from "react";

export default function HuffmanPage() {
  const defaultText = "wow!!!!!!!!!!!";
  const [text, updateText] = useState<string | null>(null);
  const screenWidth = useWindowWidth();

  // It would be more efficient to wrap all of this into an effect or memo,
  // but it's so low impact I'll ignore that.
  let wordFreqSplitBoxes: BoxBreakdownBox[] = [];
  let lettersByFreq: string[] = [];
  let freqByFreq: number[] = [];

  if (text) {
    // Create all boxes
    let tempBoxes = Object.entries(HuffmanTree.buildFrequencyMap(text)).map(
      (entry) => new BoxBreakdownBox(entry[0], entry[1].toString()),
    );

    // Sort them by largest number
    tempBoxes.sort((a, b) => Number(b.belowText) - Number(a.belowText));

    // splice
    wordFreqSplitBoxes.push(...tempBoxes.toSpliced(3, tempBoxes.length - 2));
    if (tempBoxes.length > 3) {
      wordFreqSplitBoxes.pop(); // Remove the last one from above
      wordFreqSplitBoxes.push(new BoxBreakdownBox("⋯", "etc."));
      wordFreqSplitBoxes.push(tempBoxes[tempBoxes.length - 1]);
    }

    // // // // //

    // Find most freq. letter

    lettersByFreq = tempBoxes.map((b) => b.boxText);
    freqByFreq = tempBoxes.map((b) => Number(b.belowText));
  }

  let firstShotTree: HuffmanTree = new HuffmanTree();
  firstShotTree.buildFromString(
    [...lettersByFreq]
      .splice(-2)
      .flatMap((a) =>
        Array(freqByFreq.at(lettersByFreq.lastIndexOf(a))).fill(a),
      )
      .join("") ?? "",
  );

  let tree: HuffmanTree = new HuffmanTree();
  let encoded = tree.buildFromString(text ?? "");

  let asciiBoxes = (text ?? "")
    .split("")
    .map((char) => new BoxBreakdownBox(char, StringToASCII(char)));

  let huffmanBoxes = (text ?? "")
    .split("")
    .map((char) => new BoxBreakdownBox(char, tree.encode(char)));

  useEffect(() => {
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
        up. We'll then sort by frequency:
      </Par>
      <BoxBreakdown input={wordFreqSplitBoxes} />
      <Par>
        Here we see that "
        {lettersByFreq.length >= 1 ? lettersByFreq[0] : <i>[nothing?]</i>}"
        occurs the most frequently, and "
        {lettersByFreq.length >= 1 ? (
          lettersByFreq[lettersByFreq.length - 1]
        ) : (
          <i>[nothing?]</i>
        )}
        " the least.
      </Par>
      <Par>
        In fact, let's look at the bottom two:{" "}
        {[...lettersByFreq].length >= 2 ? (
          <>
            <ILCode>{[...lettersByFreq].at(-2)}</ILCode> and{" "}
            <ILCode>{[...lettersByFreq].at(-1)}</ILCode>.
          </>
        ) : (
          <i>[not long enough]</i>
        )}
      </Par>
      <Par>
        We'll squish these together and create a structure like this, showing
        the letter and how often it shows up:
      </Par>
      {/* <TreeVisualization
        tree={firstShotTree}
        rotate={screenWidth <= BREAKPOINTS.phone ? 90 : 0}
      /> */}
      <Par>
        What we're doing here is essentially "combining" these letters into a
        single place. If we look at the newly created grey node, we'll see that
        the number in it represents the total, added-up frequencies of the
        letters "in" it.
      </Par>
      <Par>
        Now that we've created this little tree, we're gonna use it! We'll take
        out those bottom two letters, and then place our tree into the list,
        making sure to keep it sorted. We say that the top grey number is our
        frequency for this "character."
      </Par>
      <Par>
        We then simply repeat this process over and over again. Take the bottom
        two things off the list, combine them together and add them up, and put
        them back in the list. After we're done, we'll end up with this tree.
      </Par>
      <TreeVisualization
        tree={tree}
        rotate={screenWidth <= BREAKPOINTS.phone ? 90 : 0}
      />
      <br />
      <Heading>Wait so why did we do all that?</Heading>
      <hr />
      <Par>
        It still isn't super clear <i>why</i> we built this tree, but bear with
        me a little longer. First, we're gonna label all of the branches. Any
        time we branch left, we'll label it <ILCode>0</ILCode>. If we branch
        right, we'll label it <ILCode>1</ILCode>. So, we get:
      </Par>
      {screenWidth <= BREAKPOINTS.phone ? (
        <QuoteBox>
          Note that if you're on mobile, this is rotated for better visual
          clarity.
        </QuoteBox>
      ) : (
        <></>
      )}
      <TreeVisualization
        tree={tree}
        labelBranches={true}
        rotate={screenWidth <= BREAKPOINTS.phone ? 90 : 0}
      />
      <Par>
        Now, notice that if we "go down" the first <ILCode>0</ILCode> branch and
        ignore everything outside of it, we cut everything on the{" "}
        <ILCode>1</ILCode> side away. If we start by going down that left
        branch, we know we are guaranteed that we cannot reach anything on the
        right.
      </Par>
      <Par>
        So, we keep cutting down branches, until finally we get to a node
        without any other nodes below it. At this point, we cannot get to
        absolutely anything else other than the text contained inside that node,
        and so we stop.
      </Par>
      <Par>
        Therefore, with a specific pair of <ILCode>0</ILCode>s and{" "}
        <ILCode>1</ILCode>s, we can reach any letter in our tree. That sounds
        like an encoding! Lets write out all of these paths:
      </Par>
      <TWrap>
        <STable>
          <thead>
            <tr>
              <Th>Char</Th>
              <Th>Path</Th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tree.codes).map((code) => (
              <tr key={code[1]}>
                <Td>{code[0]}</Td>
                <Td>{code[1]}</Td>
              </tr>
            ))}
          </tbody>
        </STable>
      </TWrap>
      <Par>
        If you just looked at these codes on their own, it might feel hard to
        prove that there isn't any overlap. How would we know for sure that one
        code starts somewhere and ends somewhere else?
      </Par>
      <Par>
        But, if you think back to the tree, realize that as we "take a path" by
        having either a zero or a one, there's no way to get confused about
        where we're going. You'd always end up somewhere!
      </Par>
      <br />
      <Par>
        Earlier, I presented two problems. We've solved the first: we know where
        characters start and end.
      </Par>
      <Par>
        Sneakily, though, we also solved the second! Because we kept our list
        sorted by frequency, things that didn't occur much got shoved to the
        very bottom of the tree. Ergo, they have the longest paths!
      </Par>
      <br />
      <Heading>So, how'd we do?</Heading>
      <hr />
      <Par>We've done all this, but how much has it actually helped?</Par>
      <Par>
        The ASCII encoded version of our string takes{" "}
        <ILCode>{StringToASCII(text ?? "").length}</ILCode> bits:
      </Par>
      <BoxBreakdown input={asciiBoxes} />
      <Par>
        While the Huffman coding takes <ILCode>{encoded.length}</ILCode> bits:
      </Par>
      <BoxBreakdown input={huffmanBoxes} />
      <Par>That's a pretty major reduction!</Par>
      <br />
      <Par>
        So, now that we've made accounting a bit happier, we'll live to see
        another day! While you're here, go ahead and change the text used in
        this article. Put anything in below, and scroll back up to see the
        changes! I've also thrown the tree down below again, just for easy
        access. Play around with it!
      </Par>
      <br />
      <input
        type="text"
        value={text ?? ""}
        onChange={(e) => updateText(e.target.value)}
      ></input>
      <TreeVisualization
        tree={tree}
        labelBranches={true}
        rotate={screenWidth <= BREAKPOINTS.phone ? 90 : 0}
      />
    </StandardPageWrapper>
  );
}
