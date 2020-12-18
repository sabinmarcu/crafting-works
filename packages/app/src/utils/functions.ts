export const uniq = <T extends any>(
  input: T[],
  extract: (input: T) => any = (it) => it,
): T[] => [...input].filter(
    (it, idx, arr) => {
      const match = extract(it);
      const midx = arr.findIndex((i) => extract(i) === match);
      return midx === idx;
    },
  );
