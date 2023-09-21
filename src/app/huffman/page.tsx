"use client";

import QuoteBox from "@/components/QuoteBox";
import StandardPageWrapper from "@/components/StandardPageWrapper";
import { Heading, Par } from "@/components/StyledSmalls";

export default function HuffmanPage() {
  return (
    <StandardPageWrapper>
      <Heading>
        Huffman Coding (but the current content really should be moved to
        /introduction)
      </Heading>
      <hr />
      <Par>
        Imagine you have some big block of text that you want a computer to
        store, such as the following:
      </Par>
      <QuoteBox>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mollis
        sem sit amet ex vulputate ullamcorper non eget nunc. Mauris vitae felis
        condimentum, cursus diam sed, maximus nibh. Quisque sed purus felis.
        Donec laoreet sodales dolor. Donec tincidunt augue id faucibus tempus.
        Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent
        fringilla malesuada consequat. Integer tincidunt sem dui, mollis posuere
        erat maximus a. Suspendisse placerat turpis vel sagittis venenatis.
        Proin ultrices sit amet turpis ut rutrum. Nulla mollis eros urna, et
        dictum nisl tempus sit amet. Duis risus leo, sollicitudin eget arcu id,
        imperdiet ultrices felis. Vivamus ut mi in nibh varius pretium non quis
        urna. Etiam volutpat dui fermentum elit posuere sagittis. Nam metus
        odio, scelerisque condimentum libero sit amet, rutrum iaculis lorem.
        Morbi pharetra ligula nisi. Donec ac lorem velit. Quisque id nisi a
        lacus laoreet egestas non ut nisi. Nulla semper luctus nunc in placerat.
        Quisque tincidunt volutpat ante, a sollicitudin libero posuere ut.
        Integer nec magna metus... <br />
      </QuoteBox>
      <Par>
        In order to store and display that, we have to somehow convert all that
        text into something a computer can understand. We call this process{" "}
        <i>encoding</i>. A common way to represent standard english text is
        through ASCII [popup] encoding. ASCII is an 8*[popup]-bit encoding
        scheme, which is still widely recognized and used [popup].
      </Par>
    </StandardPageWrapper>
  );
}
