import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { serverFunctions } from '../../utils/serverFunctions';

// import { validateOutputCell } from '../../utils/validation';

const OutputPane = ({ onHide, onAccept }) => {
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
          // eslint-disable-next-line no-console
          console.log('Failed to get selected cell: ', error);
        });
    }, 1000); // Poll every 1 second

    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const acceptOutput = async () => {
    setLoadingState(true); // Start loading

    const formula = await serverFunctions.getCellFormula(selectedCell);
    console.log(formula);

    if (!formula) {
      setErrorMessage('Selected cell must contain a formula');
      setLoadingState(false); // Stop loading
      return;
    }

    // If there's no error, clear the error message, set the cell color, and accept the output
    setErrorMessage('');
    onAccept(selectedCell, 'output', {});
    setLoadingState(false); // Stop loading
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

OutputPane.propTypes = {
  onHide: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default OutputPane;
