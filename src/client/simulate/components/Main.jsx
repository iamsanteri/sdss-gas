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

const Main = () => {
  const [isInputPaneVisible, setInputPaneVisible] = useState(false);
  const [loadingDeleteState, setLoadingDeleteState] = useState(false);
  const [appState, setAppState] = useState([]);

  useEffect(() => {
    serverFunctions.loadSimData().then(setAppState);
  }, []);

  const showInputPane = () => {
    setInputPaneVisible(true);
  };

  const hideInputPane = () => {
    setInputPaneVisible(false);
  };

  const acceptVariable = (cellNotation, varType, additionalDataObj) => {
    const newVariable = {
      // See application state schema in state.js
      [cellNotation]: {
        timestamp: new Date().toISOString(),
        type: varType,
        additionalData: additionalDataObj,
      },
    };
    const newAppState = [...appState, newVariable];
    const cellA1Notation = Object.keys(newVariable)[0];

    if (cellA1Notation) {
      serverFunctions
        .setCellColor(cellA1Notation, 'yellow')
        .then(() => serverFunctions.saveSimData(newAppState))
        .then(() => {
          setAppState(newAppState);
        });
    } else {
      serverFunctions.saveSimData(newAppState).then(() => {
        setAppState(newAppState);
      });
    }
    // Delay hiding the input pane by 2 seconds
    setTimeout(hideInputPane, 2000);
  };

  const deleteVariable = (cellNotation) => {
    setLoadingDeleteState(true);
    const newAppState = appState.filter(
      (variable) => !(cellNotation in variable)
    );

    serverFunctions
      .clearCellColor(cellNotation)
      .then(() => {
        serverFunctions
          .saveSimData(newAppState)
          .then(() => {
            setAppState(newAppState);
            setLoadingDeleteState(false);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Error saving sim data:', error);
          });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error clearing cell color:', error);
      });
  };

  return (
    <div>
      {isInputPaneVisible ? (
        <InputPane onHide={hideInputPane} onAccept={acceptVariable} />
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
        {appState.map((item, index) => {
          const cellNotation = Object.keys(item)[0];
          const uncertainData = item[cellNotation].additionalData;
          return (
            <ListItem key={index}>
              <ListItemText
                primary={cellNotation}
                secondary={`Timestamp: ${item[cellNotation].timestamp} - Type: ${item[cellNotation].type} - Min: ${uncertainData.min} - Max: ${uncertainData.max}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteVariable(cellNotation)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Main;
