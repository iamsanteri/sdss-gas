import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

import { serverFunctions } from '../../utils/serverFunctions';

const InputPane = ({ onHide, onAccept }) => {
  const [selectedCell, setSelectedCell] = useState('A1');

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

  const acceptInput = () => {
    serverFunctions.setCellColor(selectedCell);
    onAccept(selectedCell);
  };

  return (
    <div>
      <p>Selected cell: {selectedCell}</p>
      <Button
        variant="text"
        color="success"
        size="small"
        disableElevation
        onClick={acceptInput}
      >
        Accept
      </Button>
      <Button
        variant="text"
        color="success"
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
