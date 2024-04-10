import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { serverFunctions } from '../../utils/serverFunctions';

import { validateInput } from '../../utils/clientValidation';

import DistrSelection from './DistrSelection';

const InputPane = ({ onHide, onAccept, appState }) => {
  const defaultCellValue = 'Getting cell...';
  const [selectedCell, setSelectedCell] = useState(defaultCellValue);
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
          console.log('Failed to get selected cell: ', error);
        });
    }, 1000); // Poll every 1 second

    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const acceptInput = async (event) => {
    event.preventDefault();

    const min = inputRefs.current.min.current.value;
    const max = inputRefs.current.max.current.value;

    const validationError = validateInput(min, max);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoadingState(true);
      const sheetName = await serverFunctions.getSheetNameOfSelectedCell();
      const additionalData = {
        min: min || '',
        max: max || '',
      };

      // Check if the cell is already in the state
      const isCellInState = appState.some(
        (variable) =>
          variable.cellNotation === selectedCell &&
          variable.sheetName === sheetName
      );

      if (isCellInState) {
        setErrorMessage('This cell has already been chosen for simulation');
        return;
      }

      await onAccept('input', additionalData, selectedCell, sheetName);
      onHide();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <form className="valuePane" onSubmit={acceptInput}>
      <DistrSelection />
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
  appState: PropTypes.array.isRequired,
  inputVariables: PropTypes.array.isRequired,
};

export default InputPane;
