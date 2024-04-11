// eslint-disable-next-line import/prefer-default-export
export const normalDistribution = (mean, standardDeviation) => {
  const u1 = Math.random();
  const u2 = Math.random();
  const R = Math.sqrt(-2.0 * Math.log(u1));
  const theta = 2.0 * Math.PI * u2;
  const z1 = R * Math.cos(theta);
  return z1 * standardDeviation + mean;
};
