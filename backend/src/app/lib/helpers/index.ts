export function getWithAndHeith({
  height,
  width,
}: {
  height: number;
  width: number;
}) {
  const sizeMap: { max: number; divisor: number }[] = [
    { max: 1000, divisor: 2 },
    { max: 2000, divisor: 3 },
    { max: 3000, divisor: 4 },
    { max: Infinity, divisor: 5 }, // Larger than 3000
  ];

  if (height > 700) {
    //
    for (const { max, divisor } of sizeMap) {
      if (height <= max) {
        height = height / divisor;

        break;
      }
    }
  }
  if (width > 700) {
    for (const { max, divisor } of sizeMap) {
      if (width <= max) {
        width = width / divisor;

        break;
      }
    }
  }

  return { height, width };
}
