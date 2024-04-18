import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  CircularProgress,
  Typography,
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
} from '@mui/material';

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
  const [finalSelectedCell, setFinalSelectedCell] = useState(defaultCellValue);

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
    setFinalSelectedCell(selectedCell);
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
          validationError =
            'Please select valid distribution and input parameters.';
      }

      if (validationError) {
        setErrorMessage(validationError);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

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
      <Card>
        <CardContent>
          <Typography variant="h5">
            Selection: {loadingState ? finalSelectedCell : selectedCell}
          </Typography>
          <DistrSelection
            appState={appState}
            onInputChange={handleInputChange}
          />
          {errorMessage && (
            <Box m={1}>
              <Alert severity="error">{errorMessage}</Alert>
            </Box>
          )}
        </CardContent>
        <CardActions>
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
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

InputPane.propTypes = {
  onHide: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  appState: PropTypes.array.isRequired,
};

export default InputPane;
