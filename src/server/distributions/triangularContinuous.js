// eslint-disable-next-line import/prefer-default-export
export const triangularDistribution = (min, mode, max) => {
  const fc = (mode - min) / (max - min);
  const u = Math.random();
  let x;

  if (u < fc) {
    x = (max - min) * (mode - min);
    return min + Math.sqrt(x * u);
  }

  x = (max - min) * (max - mode);
  return max - Math.sqrt(x * (1.0 - u));
};
