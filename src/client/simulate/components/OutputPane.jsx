import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from '@mui/material';

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
          setErrorMessage(error);
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
      setLoadingState(false);
      setErrorMessage('Selected cell must contain a formula');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    setErrorMessage('');
    try {
      const additionalData = { formula, name };

      if (!name) {
        setLoadingState(false);
        setErrorMessage('Please choose a short name for your output');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        return;
      }

      if (name.length > 15) {
        setLoadingState(false);
        setErrorMessage('Name must be 15 characters or less');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        return;
      }

      // Check if the cell is already in the state
      const isCellInState = appState.some(
        (variable) =>
          variable.cellNotation === selectedCell &&
          variable.sheetName === sheetName
      );

      if (isCellInState) {
        setLoadingState(false);
        setErrorMessage('This cell has already been chosen for simulation');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        return;
      }

      await onAccept('output', additionalData, selectedCell, sheetName);
      onHide();
    } catch (error) {
      setLoadingState(false);
      setErrorMessage('Error', error);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        acceptOutput();
      }}
    >
      <Card>
        <CardContent>
          <Box mb={3}>
            <Typography variant="h6">
              Selection:{' '}
              <span className="selected-cell">
                {loadingState ? finalSelectedCell : selectedCell}
              </span>
            </Typography>
          </Box>
          <TextField
            type="text"
            size="small"
            label="Output name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errorMessage && (
            <Box mt={2}>
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
            sx={{ marginLeft: '0 !important' }}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

OutputPane.propTypes = {
  onHide: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  appState: PropTypes.array.isRequired,
};

export default OutputPane;
