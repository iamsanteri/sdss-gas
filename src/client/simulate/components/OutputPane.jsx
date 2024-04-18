import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, Box, CircularProgress } from '@mui/material';

import { serverFunctions } from '../../utils/serverFunctions';

const OutputPane = ({ onHide, onAccept, appState }) => {
  const defaultCellValue = 'Getting cell...';
  const [selectedCell, setSelectedCell] = useState(defaultCellValue);
  const [finalSelectedCell, setFinalSelectedCell] = useState(defaultCellValue);
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');

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
    setFinalSelectedCell(selectedCell);

    const sheetName = await serverFunctions.getSheetNameOfSelectedCell();
    const formula = await serverFunctions.getCellFormula(selectedCell);

    if (!formula) {
      setErrorMessage('Selected cell must contain a formula');
      setLoadingState(false);
      return;
    }

    setErrorMessage('');
    try {
      const additionalData = { formula, name };

      if (!name) {
        setErrorMessage('Please choose a short name for your output');
        setLoadingState(false);
        return;
      }

      if (name.length > 15) {
        setErrorMessage('Name must be 15 characters or less');
        setLoadingState(false);
        return;
      }

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
      <p>Selection: {loadingState ? finalSelectedCell : selectedCell}</p>
      <div className="distr-outputs">
        <TextField
          type="text"
          size="small"
          label="Output name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Box mt={2} mb={2} />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <Button
        variant="text"
        color="primary"
        size="small"
        disableElevation
        type="submit"
        disabled={selectedCell === defaultCellValue}
      >
        {loadingState ? <CircularProgress size={14} /> : 'Accept'}
      </Button>
      <Button
        variant="text"
        color="secondary"
        size="small"
        disableElevation
        onClick={onHide}
        sx={{ marginLeft: '0 !important' }}
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
