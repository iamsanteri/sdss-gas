import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { serverFunctions } from '../../utils/serverFunctions';

import {
  validateUniformContinuous,
  validateTriangularContinuous,
  validateNormalContinuous,
} from '../../utils/clientValidation';

import DistrSelection from './DistrSelection';

const InputPane = ({ onHide, onAccept, appState }) => {
  const defaultCellValue = 'Getting cell...';
  const [selectedCell, setSelectedCell] = useState(defaultCellValue);
  const [selectedDistribution, setSelectedDistribution] = useState('');
  const [additionalData, setAdditionalData] = useState({});
  const [loadingState, setLoadingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = ({ name, value, distributionType }) => {
    setAdditionalData((prevData) => ({ ...prevData, [name]: value }));
    setSelectedDistribution(distributionType);
  };

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
    setLoadingState(true);
    try {
      // Check whether inputs are valid
      let validationError;
      switch (selectedDistribution) {
        case 'uniformContinuous': {
          const { min, max } = additionalData;
          validationError = validateUniformContinuous(min, max);
          break;
        }
        case 'triangularContinuous': {
          const { min, mode, max } = additionalData;
          validationError = validateTriangularContinuous(min, mode, max);
          break;
        }
        case 'normalContinuous': {
          const { mean, stdDev } = additionalData;
          validationError = validateNormalContinuous(mean, stdDev);
          break;
        }
        // Add cases for other distribution types as above...
        default:
          validationError = 'Please select distribution and parameters.';
      }

      if (validationError) {
        setErrorMessage(validationError);
        return;
      }

      const sheetName = await serverFunctions.getSheetNameOfSelectedCell();

      // Check if the cell is already in state
      const isCellInState = appState.some(
        (variable) =>
          variable.cellNotation === selectedCell &&
          variable.sheetName === sheetName
      );

      if (isCellInState) {
        setErrorMessage('This cell has already been chosen for simulation');
        return;
      }

      await onAccept(
        'input',
        { ...additionalData, distributionType: selectedDistribution },
        selectedCell,
        sheetName
      );
      onHide();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <form onSubmit={acceptInput}>
      <p>Selection: {selectedCell}</p>
      <DistrSelection appState={appState} onInputChange={handleInputChange} />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}{' '}
      <Box mt={2} mb={2} />
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
};

export default InputPane;
