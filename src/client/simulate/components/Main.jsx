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
import OutputPane from './OutputPane';

import { serverFunctions } from '../../utils/serverFunctions';

const Main = () => {
  const [activePane, setActivePane] = useState(null);
  const [loadingDeleteState, setLoadingDeleteState] = useState(false);
  const [appState, setAppState] = useState([]);

  const inputVariables = appState.filter(
    (item) => item[Object.keys(item)[0]].type === 'input'
  );
  const outputVariables = appState.filter(
    (item) => item[Object.keys(item)[0]].type === 'output'
  );

  const showInputPane = () => {
    setActivePane('input');
  };

  const showOutputPane = () => {
    setActivePane('output');
  };

  const hidePane = () => {
    setActivePane(null);
  };

  const acceptVariable = (cellNotation, varType, additionalDataObj) => {
    return new Promise((resolve, reject) => {
      const newVariable = {
        [cellNotation]: {
          timestamp: new Date().toISOString(),
          type: varType,
          additionalData: additionalDataObj,
        },
      };
      const cellA1Notation = Object.keys(newVariable)[0];
      const note = varType === 'input' ? 'Input variable' : 'Output variable';

      serverFunctions
        .setCellNote(cellA1Notation, note)
        .then(() => {
          setAppState((prevState) => {
            const newAppState = [...prevState, newVariable];
            serverFunctions.saveSimData(newAppState); // Use the updated state directly
            return newAppState;
          });
        })
        .then(() => {
          hidePane();
          resolve();
        })
        .catch((error) => {
          console.error('Error:', error);
          reject(error);
        });
    });
  };

  const deleteVariable = (cellNotation) => {
    setLoadingDeleteState(true);

    serverFunctions
      .clearCellNote(cellNotation)
      .then(() => {
        setAppState((prevState) => {
          const newAppState = prevState.filter(
            (variable) => !(cellNotation in variable)
          );
          serverFunctions.saveSimData(newAppState); // Use the updated state directly
          return newAppState;
        });
      })
      .then(() => {
        setLoadingDeleteState(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    serverFunctions.loadSimData().then((data) => {
      setAppState(data);
    });
  }, []);

  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        minHeight="24px"
        mt={2}
        mb={2}
      >
        {loadingDeleteState && <CircularProgress color="success" size={20} />}
      </Box>
      {activePane !== 'input' && (
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
      {activePane === 'input' && (
        <InputPane onHide={hidePane} onAccept={acceptVariable} />
      )}
      <List>
        {inputVariables.map((item, index) => {
          const cellNotation = Object.keys(item)[0];
          const uncertainData = item[cellNotation].additionalData;
          return (
            <ListItem key={index}>
              <ListItemText
                primary={cellNotation}
                secondary={`Timestamp: ${
                  item[cellNotation].timestamp
                } - Type: ${item[cellNotation].type} - Additional data: ${
                  Object.keys(uncertainData).length > 0
                    ? Object.entries(uncertainData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')
                    : 'Empty'
                }`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteVariable(cellNotation)}
                  disabled={loadingDeleteState}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      {activePane !== 'output' && (
        <Button
          variant="contained"
          color="success"
          loading="true"
          size="small"
          startIcon={<Add />}
          disableElevation
          onClick={() => showOutputPane()}
        >
          Create output
        </Button>
      )}
      {activePane === 'output' && (
        <OutputPane onHide={hidePane} onAccept={acceptVariable} />
      )}
      <List>
        {outputVariables.map((item, index) => {
          const cellNotation = Object.keys(item)[0];
          const uncertainData = item[cellNotation].additionalData;
          return (
            <ListItem key={index}>
              <ListItemText
                primary={cellNotation}
                secondary={`Timestamp: ${
                  item[cellNotation].timestamp
                } - Type: ${item[cellNotation].type} - Additional data: ${
                  Object.keys(uncertainData).length > 0
                    ? Object.entries(uncertainData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')
                    : 'Empty'
                }`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteVariable(cellNotation)}
                  disabled={loadingDeleteState}
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
