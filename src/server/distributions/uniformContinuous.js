// eslint-disable-next-line import/prefer-default-export
export const uniformDistribution = (min, max) => {
  return Math.random() * (max - min) + min;
};
