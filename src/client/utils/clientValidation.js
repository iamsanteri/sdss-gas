// eslint-disable-next-line import/prefer-default-export
export const validateInput = (min, max) => {
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
