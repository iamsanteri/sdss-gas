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

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import { Add, Delete } from '@mui/icons-material';

import InputPane from './InputPane';
import OutputPane from './OutputPane';

import { serverFunctions } from '../../utils/serverFunctions';

const Main = () => {
  const [appState, setAppState] = useState([]);
  const [activePane, setActivePane] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isReadyToSimulate, setIsReadyToSimulate] = useState(false);
  const [loadingDeleteState, setLoadingDeleteState] = useState(false);

  const inputVariables = appState.filter((item) => item.type === 'input');
  const outputVariables = appState.filter((item) => item.type === 'output');

  const showInputPane = () => {
    setActivePane('input');
  };

  const showOutputPane = () => {
    setActivePane('output');
  };

  const hidePane = () => {
    setActivePane(null);
  };

  const acceptVariable = (
    varType,
    additionalDataObj,
    cellNotation,
    sheetName
  ) => {
    return new Promise((resolve, reject) => {
      function generateShortID() {
        return Math.random().toString(36).substring(2, 7);
      }

      const id = generateShortID();
      const newVariable = {
        id,
        cellNotation,
        sheetName,
        timestamp: new Date().toISOString(),
        type: varType,
        additionalData: additionalDataObj,
      };
      const note = varType === 'input' ? 'Input variable' : 'Output variable';

      serverFunctions
        .setCellNote(cellNotation, note)
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

  const deleteVariable = (id) => {
    setLoadingDeleteState(true);

    const variableToDelete = appState.find((variable) => variable.id === id);
    const { cellNotation } = variableToDelete;

    serverFunctions
      .clearCellNote(cellNotation)
      .then(() => {
        setAppState((prevState) => {
          const newAppState = prevState.filter(
            (variable) => variable.id !== id
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

  const launchSimulation = () => {
    setIsSimulating(true);
    serverFunctions
      .runSimulation(appState)
      .then(() => {
        setIsSimulating(false);
      })
      .catch((error) => {
        console.error('An error occurred during the simulation:', error);
        setIsSimulating(false);
      });
  };

  useEffect(() => {
    const hasInput = appState.some((item) => item.type === 'input');
    const hasOutput = appState.some((item) => item.type === 'output');

    setIsReadyToSimulate(hasInput && hasOutput);
  }, [appState]);

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
        <InputPane
          onHide={hidePane}
          onAccept={acceptVariable}
          appState={appState}
        />
      )}
      <List>
        {inputVariables.map((item) => {
          const {
            id,
            cellNotation,
            timestamp,
            type,
            additionalData,
            sheetName,
          } = item;
          return (
            <ListItem key={id}>
              <ListItemText
                primary={`${cellNotation} (${sheetName})`}
                secondary={`Timestamp: ${timestamp} - Type: ${type} - Additional data: ${
                  Object.keys(additionalData).length > 0
                    ? Object.entries(additionalData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')
                    : 'Empty'
                }`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteVariable(id)}
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
        <OutputPane
          onHide={hidePane}
          onAccept={acceptVariable}
          appState={appState}
        />
      )}
      <List>
        {outputVariables.map((item) => {
          const {
            id,
            cellNotation,
            timestamp,
            type,
            additionalData,
            sheetName,
          } = item;
          return (
            <ListItem key={id}>
              <ListItemText
                primary={`${cellNotation} (${sheetName})`}
                secondary={`Timestamp: ${timestamp} - Type: ${type} - Additional data: ${
                  Object.keys(additionalData).length > 0
                    ? Object.entries(additionalData)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')
                    : 'Empty'
                }`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteVariable(id)}
                  disabled={loadingDeleteState}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <Box mt={2} mb={2}></Box>
      <Button
        variant="contained"
        color="success"
        loading="true"
        size="small"
        startIcon={<PlayArrowRoundedIcon />}
        disableElevation
        disabled={!isReadyToSimulate || isSimulating}
        onClick={() => launchSimulation()}
      >
        Simulate
      </Button>
    </div>
  );
};

export default Main;
