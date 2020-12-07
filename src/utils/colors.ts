export const randomColor = (
  range: string = '0123456789ABCDEF',
) => [
  '#',
  ...new Array(6)
    .fill(
      range[
        Math.floor(Math.random() * range.length)
      ],
    ),
].join('');

export const isHex = (input: string): boolean => /^#([0-9a-fA-F]{3}){1,2}$/.test(input);

const rgbDigitGroup = '([0-9]{1,3})';
const digitGroupRegex = new RegExp(rgbDigitGroup, 'g');
const rgbRegex = new RegExp(`^rgb\\((?:\\s*${rgbDigitGroup}\\,\\s*){2}(?:\\s*${rgbDigitGroup}\\s*)\\)$`);
const rgbaRegex = new RegExp(`^rgba\\((?:\\s*${rgbDigitGroup}\\,\\s*){3}(?:\\s*${rgbDigitGroup}\\s*)\\)$`);
const inRange = (
  start: number,
  end: number,
  ...list: string[]
) => list.filter((it) => {
  const val = parseInt(it, 10)!;
  return !(val > 0 && val < 255);
}).length === 0;
const rgbDigits = (input: string): string[] => Array.from(input.match(digitGroupRegex));
const rgbDigitsValid = (input: string[]): boolean => inRange(
  0,
  255,
  ...input,
);
const rgbaDigitsValid = (input: string[]): boolean => {
  const [alpha] = input.splice(input.length - 1, 1);
  return rgbDigitsValid(input) && inRange(0, 1, alpha);
};

export const isRGBA = (input: string): boolean => (
  rgbRegex.test(input)
  && rgbDigitsValid(rgbDigits(input))
)
  || (
    rgbaRegex.test(input)
    && rgbaDigitsValid(rgbDigits(input))
  );
