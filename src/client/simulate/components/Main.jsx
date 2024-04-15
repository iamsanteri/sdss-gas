import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Button,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  IconButton,
  Snackbar,
} from '@mui/material';

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
// DISABLED import StopRoundedIcon from '@mui/icons-material/StopRounded';

import { Add, Delete } from '@mui/icons-material';

import InputPane from './InputPane';
import OutputPane from './OutputPane';
import SimulationSettings from './SimulationSettings';
import PresentOutputs from './PresentOutputs';

import { serverFunctions } from '../../utils/serverFunctions';

const Main = () => {
  const [appState, setAppState] = useState([]);
  const [errorNotif, setErrorNotif] = useState(null);
  const [activePane, setActivePane] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [numSimulationRuns, setNumSimulationRuns] = useState(100);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isReadyToSimulate, setIsReadyToSimulate] = useState(false);
  const [loadingDeleteState, setLoadingDeleteState] = useState(false);
  const [showFullOutputClicked, setShowFullOutputClicked] = useState(false);

  const MAX_INPUTS = 3;
  const MAX_OUTPUTS = 2;

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  // useMemo for Filtering (performance)
  const inputVariables = useMemo(
    () => appState.filter((item) => item.type === 'input'),
    [appState]
  );
  const outputVariables = useMemo(
    () => appState.filter((item) => item.type === 'output'),
    [appState]
  );

  // useCallback for Functions (performance)
  const showInputPane = useCallback(() => {
    // Check if the limit has been reached
    if (inputVariables.length >= MAX_INPUTS) {
      handleSnackbarOpen(
        'Maximum number of input variables reached for this Beta version.'
      );
      return;
    }

    setActivePane('input');
  }, [inputVariables]);

  const showOutputPane = useCallback(() => {
    // Check if the limit has been reached
    if (outputVariables.length >= MAX_OUTPUTS) {
      handleSnackbarOpen(
        'Maximum number of output variables reached for this Beta version.'
      );
      return;
    }

    setActivePane('output');
  }, [outputVariables]);

  const hidePane = useCallback(() => {
    setActivePane(null);
  }, []);

  const acceptVariable = (
    varType,
    additionalDataObj,
    cellNotation,
    sheetName
  ) => {
    return new Promise((resolve, reject) => {
      if (
        (varType === 'input' && inputVariables.length >= MAX_INPUTS) ||
        (varType === 'output' && outputVariables.length >= MAX_OUTPUTS)
      ) {
        handleSnackbarOpen(
          `Maximum number of ${varType} variables reached for this Beta version.`
        );
        reject(
          new Error(
            `Maximum number of ${varType} variables reached for this Beta version.`
          )
        );
        return;
      }

      function generateShortID() {
        return Math.random().toString(36).substring(2, 7);
      }

      const { distributionType } = additionalDataObj;

      if (varType === 'input' && !distributionType) {
        setErrorNotif(
          'Error: No distribution type selected for input variable'
        );
        reject(new Error('No distribution type selected for input variable'));
        return;
      }

      const id = generateShortID();
      const newVariable = {
        id,
        cellNotation,
        sheetName,
        timestamp: new Date().toISOString(),
        type: varType,
        additionalData: {
          ...additionalDataObj,
          distributionType,
        },
      };

      const note =
        varType === 'input'
          ? 'Simulation: Input variable'
          : 'Simulation: Output variable';

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
          setErrorNotif(error);
          reject(error);
        });
    });
  };

  const deleteVariable = (id, sheetName) => {
    setLoadingDeleteState(true);

    const variableToDelete = appState.find((variable) => variable.id === id);
    const { cellNotation } = variableToDelete;

    serverFunctions
      .clearCellNote(sheetName, cellNotation)
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
        setErrorNotif(error);
      });
  };

  const launchSimulation = () => {
    setIsSimulating(true);
    setErrorNotif(null);
    serverFunctions
      .runSimulation(appState, numSimulationRuns)
      .then((resolvedStats) => {
        setIsSimulating(false);
        setShowFullOutputClicked(false);
        setSimulationResults(resolvedStats.statistics);
      })
      .catch((error) => {
        const message = `Simulation ran into issues - Try to re-run. ${error}`;
        setErrorNotif(message);
        setIsSimulating(false);
      });
  };

  const resetSimulation = () => {
    // Reset state
    setAppState([]);
    setErrorNotif(null);
    setActivePane(null);
    setIsSimulating(false);
    setNumSimulationRuns(100);
    setSimulationResults(null);
    setIsReadyToSimulate(false);
    setLoadingDeleteState(false);
    setShowFullOutputClicked(false);

    // Clear notes
    appState.forEach((variable) => {
      const { cellNotation, sheetName } = variable;
      serverFunctions.clearCellNote(sheetName, cellNotation);
    });

    // Clear storage
    serverFunctions.resetSimData();
  };

  // DISABLED
  // const stopSimulation = () => {
  //   setIsSimulating(false);
  //   serverFunctions.stopSimulation();
  // };

  let buttonText;
  if (simulationResults) {
    buttonText = 'Re-simulate';
  } else if (isSimulating) {
    buttonText = 'Simulating';
  } else {
    buttonText = 'Start Simulation';
  }

  useEffect(() => {
    const hasInput = appState.some((item) => item.type === 'input');
    const hasOutput = appState.some((item) => item.type === 'output');

    setIsReadyToSimulate(hasInput && hasOutput);
  }, [appState]);

  useEffect(() => {
    serverFunctions.loadSimData().then((data) => {
      if (Array.isArray(data)) {
        setAppState(data);
      } else {
        console.error(
          'loadSimData did not return an array. Setting it now',
          data
        );
        setAppState([]); // Set appState to an empty array as a fallback
      }
    });
  }, []);

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={4000}
        action={
          <Button
            className="close-snackbar"
            size="small"
            onClick={handleSnackbarClose}
          >
            CLOSE
          </Button>
        }
      />
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
          disabled={isSimulating}
        >
          Create input assumption
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
                  onClick={() => deleteVariable(id, sheetName)}
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
          disabled={isSimulating}
        >
          Create forecast output
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
                primary={`${cellNotation} (${sheetName}): ${additionalData.name}`}
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
                  onClick={() => deleteVariable(id, sheetName)}
                  disabled={loadingDeleteState}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <SimulationSettings
        numSimulationRuns={numSimulationRuns}
        setNumSimulationRuns={setNumSimulationRuns}
        isSimulating={isSimulating}
      />
      <Box mt={2} mb={2} />
      {errorNotif && <p style={{ color: 'red' }}>{errorNotif}</p>}
      <Box mt={2} mb={2} />
      <Button
        variant="contained"
        color="success"
        size="small"
        startIcon={
          isSimulating ? (
            <CircularProgress size={15} color="inherit" />
          ) : (
            <PlayArrowRoundedIcon />
          )
        }
        disableElevation
        disabled={!isReadyToSimulate || isSimulating}
        onClick={() => launchSimulation()}
      >
        {buttonText}
      </Button>
      <Button
        variant="text"
        color="error"
        size="small"
        disableElevation
        onClick={resetSimulation}
        style={{ marginLeft: '5px' }}
        disabled={isSimulating || !isReadyToSimulate} // Disable button when isSimulating is true or isReadyToSimulate is false
      >
        Reset
      </Button>
      {/* DISABLED
      <Box mt={2} mb={2} />
      <Button
        variant="contained"
        color="secondary"
        size="small"
        disableElevation
        startIcon={<StopRoundedIcon />}
        disabled={!isSimulating}
        onClick={stopSimulation}
      >
        Stop
      </Button>
      */}
      {!isSimulating && simulationResults && !errorNotif && (
        <PresentOutputs
          results={simulationResults}
          showFullOutputClicked={showFullOutputClicked}
          setShowFullOutputClicked={setShowFullOutputClicked}
        />
      )}
      {isSimulating ? (
        <Box mt={2} mb={2}>
          <Alert severity="info">
            Currently there is no option to pause or stop the simulation while
            running.
          </Alert>
          <Box mt={2} mb={2} />
          <Alert severity="warning">
            Don&apos;t delete the newly created hidden sheet during simulation,
            that&apos;s where your output will be presented.
          </Alert>
        </Box>
      ) : null}
    </div>
  );
};

export default Main;
