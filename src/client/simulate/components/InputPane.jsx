import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { serverFunctions } from '../../utils/serverFunctions';

import { validateInput } from '../../utils/validation';

const InputPane = ({ onHide, onAccept }) => {
  const defaultCellValue = 'Getting cell...';
  const [selectedCell, setSelectedCell] = useState(defaultCellValue);
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // New state variable for error message

  const inputRefs = useRef({
    min: React.createRef(),
    max: React.createRef(),
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      serverFunctions
        .getSelectedCell()
        .then((cell) => {
          setSelectedCell(cell);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log('Failed to get selected cell: ', error);
        });
    }, 1000); // Poll every 1 second

    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const acceptInput = (event) => {
    event.preventDefault();

    const min = inputRefs.current.min.current.value;
    const max = inputRefs.current.max.current.value;

    const validationError = validateInput(min, max);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const additionalData = { min: min || '', max: max || '' };

    serverFunctions.setCellColor(selectedCell);
    onAccept(selectedCell, 'input', additionalData);
    setLoadingState(true);
  };

  return (
    <form className="uncertainInputs" onSubmit={acceptInput}>
      <p>Selection: {selectedCell}</p>
      <TextField
        type="number"
        size="small"
        label="Min Value"
        name="min"
        inputRef={inputRefs.current.min}
      />
      <TextField
        type="number"
        size="small"
        label="Max Value"
        name="max"
        inputRef={inputRefs.current.max}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}{' '}
      {/* Display error message */}
      <LoadingButton
        variant="text"
        color="success"
        size="small"
        disableElevation
        type="submit"
        disabled={selectedCell === defaultCellValue}
        loading={loadingState}
      >
        Accept
      </LoadingButton>
      <Button
        variant="text"
        color="error"
        size="small"
        disableElevation
        onClick={onHide}
      >
        Cancel
      </Button>
    </form>
  );
};

InputPane.propTypes = {
  onHide: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default InputPane;
