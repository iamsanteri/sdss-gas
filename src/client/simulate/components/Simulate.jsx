import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  IconButton,
} from '@mui/material';

import { Add, Delete } from '@mui/icons-material';

import InputPane from './InputPane';

import { serverFunctions } from '../../utils/serverFunctions';

// This is a wrapper for google.script.run that lets us use promises.
// import { serverFunctions } from '../../utils/serverFunctions';

const Simulate = () => {
  const [isInputPaneVisible, setInputPaneVisible] = useState(false);
  const [loadingDeleteState, setLoadingDeleteState] = useState(false);
  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    serverFunctions.loadSimData().then(setInputs);
  }, []);

  const showInputPane = () => {
    setInputPaneVisible(true);
  };

  const hideInputPane = () => {
    setInputPaneVisible(false);
  };

  const acceptInput = (input) => {
    const newInputs = [...inputs, input];
    if (input.cellA1Notation) {
      serverFunctions
        .setCellColor(input.cellA1Notation, 'yellow')
        .then(() => serverFunctions.saveSimData(newInputs))
        .then(() => {
          setInputs(newInputs);
        });
    } else {
      serverFunctions.saveSimData(newInputs).then(() => {
        setInputs(newInputs);
      });
    }
    // Delay hiding the input pane by 1,5 seconds
    setTimeout(hideInputPane, 1500);
  };

  const deleteInput = (index) => {
    setLoadingDeleteState(true);
    try {
      const cellA1Notation = inputs[index];
      const newInputs = inputs.filter((_, i) => i !== index);

      serverFunctions
        .clearCellColor(cellA1Notation)
        .then(() => {
          serverFunctions
            .saveSimData(newInputs)
            .then(() => {
              setInputs(newInputs);
              setLoadingDeleteState(false);
            })
            .catch((error) => {
              console.error('Error saving sim data:', error);
            });
        })
        .catch((error) => {
          console.error('Error clearing cell color:', error);
        });
    } catch (error) {
      console.error('Error in deleteInput:', error);
    }
  };

  return (
    <div>
      {isInputPaneVisible ? (
        <InputPane onHide={hideInputPane} onAccept={acceptInput} />
      ) : (
        <Button
          variant="contained"
          color="success"
          loading="true"
          size="small"
          startIcon={<Add />}
          disableElevation
          onClick={() => showInputPane()}
        >
          Create input
        </Button>
      )}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        minHeight="24px"
        mt={3} // Set a minimum height
        mb={-2} // Set a negative margin to overlap the list
      >
        {loadingDeleteState && (
          <CircularProgress
            color="success"
            size={20} // Adjust the size here
          />
        )}
      </Box>
      <List>
        {inputs.map((input, index) => (
          <ListItem key={index}>
            <ListItemText primary={input} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteInput(index)}
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Simulate;
