import { BREAKPOINTS, COLORS } from "@/lib/constants";
import StringToASCII from "@/lib/encodings/ascii";
import { useWindowWidth } from "@react-hook/window-size";
import { Coordinates, Mafs, Polygon, Text, Transform, vec, Vector } from "mafs";
import styled from "styled-components";

/**
 * Simple class for representing a box in the boxBreakdown
 */
export class BoxBreakdownBox {
  boxText: string;
  belowText: string;

  /**
   *
   */
  constructor(boxText: string, belowText: string) {
    this.boxText = boxText;
    this.belowText = belowText;
  }
}

interface Props {
  input: BoxBreakdownBox[];
}

export default function BoxBreakdown({ input }: Props) {
  const MAX_CHAR_IN_LINE_DESKTOP = 12; // Max character boxes in a single line
  const MAX_CHAR_IN_LINE_TABLET = 6; // Max character boxes in a single line
  const MAX_CHAR_IN_LINE_MOBILE = 4; // Max character boxes in a single line
  const SIZE_VIEW_MIN_CHARS = 4; // Minimum initalized size
  const GAP_HORIZ = 0.6; // Horizontal gap between character boxes
  const GAP_VERT = 0.6; // Vertical gap between lines
  const GAP_BELOW = 0.25; // Gap between the bottom of the box and the binary
  const SIZE_BOX = 1; // Size of the box's sides.
  const MAGIC_PIXEL_SCALE = 46; // APPROXIMATE size of 1 unit in actual-pixels. Used for height of container.

  // Possibly calculate-on-the-fly?
  const SIZE_TEXT_MAIN = 30; // Size of the char in the box
  const SIZE_TEXT_BELOW = 15; // Size of the text below the box

  const screenWidth = useWindowWidth();
  let MAX_CHAR_IN_LINE = MAX_CHAR_IN_LINE_DESKTOP;
  if (screenWidth <= BREAKPOINTS.phone) {
    MAX_CHAR_IN_LINE = MAX_CHAR_IN_LINE_MOBILE;
  } else if (screenWidth <= BREAKPOINTS.tablet) {
    MAX_CHAR_IN_LINE = MAX_CHAR_IN_LINE_TABLET;
  }

  // Creates a properly-placed box with it's char and ASCII representation.
  // TODO: I didn't originally know about <Transform> when writing this,
  // but now I do and you could totally simplify the offset logic with that.
  // Left as an exercise for the reader, let's say.
  const MakeBox = (row: number, column: number, box: BoxBreakdownBox) => {
    // Origin of the top left point of the box
    const Origin: vec.Vector2 = [
      column * SIZE_BOX + column * GAP_HORIZ,
      (row * SIZE_BOX + row * GAP_VERT) * -1,
    ];

    // console.log(Origin);

    return (
      <Transform key={row + "_" + column}>
        {/* <Vector tail={[0, 0]} tip={Origin} /> */}

        {/* Main box */}
        <Polygon
          points={[
            [Origin[0], Origin[1]],
            [Origin[0] + SIZE_BOX, Origin[1]],
            [Origin[0] + SIZE_BOX, Origin[1] - SIZE_BOX],
            [Origin[0], Origin[1] - SIZE_BOX],
          ]}
        />

        {/* Text in box */}
        <Text
          x={Origin[0] + SIZE_BOX / 2}
          y={Origin[1] - SIZE_BOX / 2}
          size={SIZE_TEXT_MAIN}
        >
          {box.boxText}
        </Text>

        {/* Text below box */}
        <Text
          x={Origin[0] + SIZE_BOX / 2}
          y={Origin[1] - SIZE_BOX - GAP_BELOW}
          size={SIZE_TEXT_BELOW}
        >
          {box.belowText}
        </Text>
      </Transform>
    );
  };

  // Find the horizontal size needed, in "mafs units."
  // Takes the max between "smallest wanted line size" and "current or largest wanted line size"
  // Basically, will grow from MIN_CHARS to MAX_CHARS horizontally, adjusting along the way.
  const viewSizeX = Math.max(
    SIZE_VIEW_MIN_CHARS * (GAP_HORIZ + SIZE_BOX) - GAP_HORIZ,
    Math.min(MAX_CHAR_IN_LINE, input.length) * (GAP_HORIZ + SIZE_BOX) -
      GAP_HORIZ,
  );

  // Find the vertical size needed, in "mafs units."
  // Takes the larger between "smallest wanted size" and "current or largest wanted size"
  const viewSizeY =
    -1 *
    Math.max(
      1 * (GAP_VERT + SIZE_BOX) - GAP_VERT,
      // We use ceil because we're doing a count
      Math.ceil(input.length / MAX_CHAR_IN_LINE) * (GAP_VERT + SIZE_BOX) -
        GAP_VERT,
    );

  return (
    <Container>
      <Mafs
        pan={false}
        viewBox={{ x: [0, viewSizeX], y: [viewSizeY, 0] }}
        height={(-1 * viewSizeY + 1) * MAGIC_PIXEL_SCALE}
      >
        {/* <Coordinates.Cartesian /> */}
        {/* <Vector tail={[0, 0]} tip={[viewSizeX, viewSizeY]} /> */}
        {input.map((c, i) => {
          const row = Math.floor(i / MAX_CHAR_IN_LINE); // We use floor because we're 0 indexed
          const column = i % MAX_CHAR_IN_LINE;
          return MakeBox(row, column, c);
        })}
      </Mafs>
    </Container>
  );
}

const Container = styled.div`
  /* border: 1px solid ${COLORS.text}; */
  pointer-events: none;
`;
