export const validateUniformContinuous = (min, max) => {
  let errorMessage = '';

  if (!min || !max) {
    errorMessage = 'Both fields must be filled';
  } else if (Number.isNaN(Number(min)) || Number.isNaN(Number(max))) {
    errorMessage = 'Both fields must be valid numbers';
  } else if (Number(min) >= Number(max)) {
    errorMessage = 'Min value must be smaller than Max value';
  }

  return errorMessage;
};

export const validateTriangularContinuous = (min, mode, max) => {
  let errorMessage = '';

  if (!min || !max || !mode) {
    errorMessage = 'All fields must be filled';
  } else if (
    Number.isNaN(Number(min)) ||
    Number.isNaN(Number(max)) ||
    Number.isNaN(Number(mode))
  ) {
    errorMessage = 'All fields must be valid numbers';
  } else if (Number(min) >= Number(mode)) {
    errorMessage = 'Min value must be smaller than Mode value';
  } else if (Number(mode) >= Number(max)) {
    errorMessage = 'Mode value must be smaller than Max value';
  }

  return errorMessage;
};

export const validateNormalContinuous = (mean, stdDev) => {
  let errorMessage = '';

  if (!mean || !stdDev) {
    errorMessage = 'Both fields must be filled';
  } else if (Number.isNaN(Number(mean)) || Number.isNaN(Number(stdDev))) {
    errorMessage = 'Both fields must be valid numbers';
  } else if (Number(stdDev) <= 0) {
    errorMessage = 'Standard deviation must be a positive number';
  }

  return errorMessage;
};
