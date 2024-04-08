import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { serverFunctions } from '../../utils/serverFunctions';

const OutputPane = ({ onHide, onAccept, appState }) => {
  const defaultCellValue = 'Getting cell...';
  const [selectedCell, setSelectedCell] = useState(defaultCellValue);
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const acceptOutput = async () => {
    setLoadingState(true);

    const sheetName = await serverFunctions.getSheetNameOfSelectedCell();
    const formula = await serverFunctions.getCellFormula(selectedCell);

    if (!formula) {
      setErrorMessage('Selected cell must contain a formula');
      setLoadingState(false);
      return;
    }

    setErrorMessage('');
    try {
      const additionalData = { sheetName, formula };

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

      await onAccept('output', additionalData, selectedCell, sheetName);
      onHide();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <form
      className="valuePane"
      onSubmit={(e) => {
        e.preventDefault();
        acceptOutput();
      }}
    >
      <p>Selection: {selectedCell}</p>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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

OutputPane.propTypes = {
  onHide: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  appState: PropTypes.array.isRequired,
};

export default OutputPane;
