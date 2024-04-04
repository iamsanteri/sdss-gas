import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { serverFunctions } from '../../utils/serverFunctions';

const InputPane = ({ onHide, onAccept }) => {
  const defaultCellValue = 'Getting...';
  const [selectedCell, setSelectedCell] = useState(defaultCellValue);
  const [loadingState, setLoadingState] = useState(false);

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

  const acceptInput = () => {
    serverFunctions.setCellColor(selectedCell);
    onAccept(selectedCell);
    setLoadingState(true);
  };

  return (
    <div>
      <p>Selection: {selectedCell}</p>
      <LoadingButton
        variant="text"
        color="success"
        size="small"
        disableElevation
        onClick={acceptInput}
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
    </div>
  );
};

InputPane.propTypes = {
  onHide: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default InputPane;
