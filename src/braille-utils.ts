export const renderText = ({
  text,
  x,
  y,
  width,
  height,
  pageWidth,
  letterSpacing,
  lineHeight,
}: {
  text: number[];
  x: number;
  y: number;
  width: number;
  height: number;
  pageWidth: number;
  letterSpacing: number;
  lineHeight: number;
}): number[][] => {
  let nextX = x;
  let nextY = y;
  return text.reduce((result: number[][], charCode: number) => {
    Array.prototype.push.apply(
      result,
      renderChar(charCode, nextX, nextY, width, height)
    );
    nextX += width + letterSpacing;
    if (pageWidth < nextX + width) {
      nextX = 0;
      nextY += lineHeight;
    }
    return result;
  }, []);
};

export const renderChar = (
  charCode: number,
  x: number,
  y: number,
  width: number,
  height: number
): number[][] => {
  const cols = 2;
  const rows = 4;
  const bits: number[] = [];
  for (let remaining = charCode; remaining != 0; remaining >>= 1) {
    bits.push(remaining % 2);
  }
  return bits.reduce((result: number[][], value: number, index: number) => {
    if (value != 0) {
      const minusRow = index % rows;
      const row = rows - minusRow;
      const col = cols - (index - minusRow) / rows;
      result.push([
        x + (col * width) / cols,
        y + (row * height) / rows,
        x + ((col + 1) * width) / cols,
        y + ((row + 1) * height) / rows,
      ]);
    }
    return result;
  }, []);
};
