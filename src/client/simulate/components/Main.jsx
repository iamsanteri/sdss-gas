import React, { useState, useEffect, useMemo, useCallback } from 'react';

import {
  ThemeProvider,
  createTheme,
  Container,
  Stack,
  Box,
  Button,
  Alert,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';

import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

import { Add, Delete } from '@mui/icons-material';

import Notifications from './Notifications';
import InputPane from './InputPane';
import OutputPane from './OutputPane';
import SimulationSettings from './SimulationSettings';
import PresentOutputs from './PresentOutputs';

import { serverFunctions } from '../../utils/serverFunctions';

const Main = () => {
  // Top level application state
  const [appState, setAppState] = useState([]);
  const [errorNotif, setErrorNotif] = useState(null);
  const [activePane, setActivePane] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [numSimulationRuns, setNumSimulationRuns] = useState(100);
  const [simulationResults, setSimulationResults] = useState(null);
  const [isReadyToSimulate, setIsReadyToSimulate] = useState(false);
  const [loadingDeleteState, setLoadingDeleteState] = useState(false);
  const [showFullOutputClicked, setShowFullOutputClicked] = useState(false);

  // Client side variable limitation flags
  const MAX_INPUTS = 3;
  const MAX_OUTPUTS = 2;

  // Theme setup
  const theme = createTheme({
    palette: {
      primary: {
        main: '#2e7d32',
      },
      secondary: {
        main: '#d32f2f',
      },
    },
    typography: {
      fontSize: 12,
      allVariants: {
        color: '#202124',
      },
      h4: {
        fontSize: '1.3rem',
      },
      h5: {
        fontSize: '0.95rem',
      },
      h6: {
        fontSize: '0.87rem',
      },
      body1: {
        fontSize: '0.8rem',
        color: '#747678',
      },
    },
  });

  const handleNotifOpen = (message) => {
    setNotifMessage(message);
    setNotifOpen(true);
  };

  const handleNotifClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setNotifOpen(false);
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
      handleNotifOpen(
        'Maximum number of input variables reached for this Beta version.'
      );
      return;
    }

    setActivePane('input');
  }, [inputVariables]);

  const showOutputPane = useCallback(() => {
    // Check if the limit has been reached
    if (outputVariables.length >= MAX_OUTPUTS) {
      handleNotifOpen(
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
        handleNotifOpen(
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

      const { distributionType, distrName } = additionalDataObj;

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
          distrName,
        },
      };

      const note =
        varType === 'input'
          ? 'Input variable used for simulation'
          : 'Output variable used for simulation';

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
    setLoadingDeleteState(true);
    setErrorNotif(null);
    serverFunctions
      .runSimulation(appState, numSimulationRuns)
      .then((resolvedStats) => {
        setIsSimulating(false);
        setShowFullOutputClicked(false);
        setLoadingDeleteState(false);
        setSimulationResults(resolvedStats.statistics);
      })
      .catch((error) => {
        const message = `Simulation ran into issues - Try to re-run. ${error}`;
        setErrorNotif(message);
        setIsSimulating(false);
        setLoadingDeleteState(false);
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
        setErrorNotif(
          `loadSimData did not return an array. Setting it now ${data}`
        );
        setAppState([]); // Set appState to an empty array as a fallback
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LinearProgress
        sx={{
          opacity: loadingDeleteState ? 1 : 0,
          marginTop: '-0.6rem',
          marginLeft: '-8px',
          marginRight: '-8px',
          width: 'calc(100% + 16px)',
        }}
      />
      <Notifications
        handleNotifClose={handleNotifClose}
        notifOpen={notifOpen}
        notifMessage={notifMessage}
      />
      <Container disableGutters>
        <Stack direction="column" justifyContent="flex-start">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            p={1.3}
          >
            <Box position="relative">
              <Typography variant="h4" sx={{ ml: 10 }}>
                Simulate
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -22,
                }}
              >
                Beta
              </Typography>
            </Box>
            {loadingDeleteState && (
              <CircularProgress
                color="primary"
                size={18}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 100,
                }}
              />
            )}
          </Box>
          <Divider
            sx={{
              marginLeft: '-8px',
              marginRight: '-8px',
              width: 'calc(100% + 16px)',
            }}
          />
          <Box>
            <Box mt={2} mb={1.5}>
              <Typography variant="h5">Input assumptions</Typography>
              <Typography variant="body1">
                Create your input here. Highlight the cell containing your
                uncertain variable and choose your parameters.
              </Typography>
            </Box>
            {activePane !== 'input' && (
              <Button
                variant="outlined"
                color="primary"
                loading="true"
                size="small"
                startIcon={<Add />}
                onClick={() => showInputPane()}
                disabled={isSimulating}
              >
                Create
              </Button>
            )}
            {activePane === 'input' && (
              <InputPane
                onHide={hidePane}
                onAccept={acceptVariable}
                appState={appState}
              />
            )}
            <Box mb={0.5} mt={0.2}>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                }}
              >
                {inputVariables.length === 0 ? (
                  <React.Fragment>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography
                            component="span"
                            variant="h6"
                            color="text.secondary"
                          >
                            [ Your first input will appear here ]
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body1">
                              To start simulating, you will need to create at
                              least one input and one output variable
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="middle" component="li" />
                  </React.Fragment>
                ) : (
                  inputVariables.map((item) => {
                    const { id, cellNotation, additionalData, sheetName } =
                      item;
                    return (
                      <React.Fragment key={id}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="h6"
                                color="text.primary"
                              >
                                {`[ ${cellNotation} ] → ${additionalData.distrName} distribution`}
                              </Typography>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography component="span" variant="body1">
                                  {`${
                                    Object.keys(additionalData).length > 0
                                      ? Object.entries(additionalData)
                                          .filter(
                                            ([, value]) =>
                                              !Number.isNaN(Number(value))
                                          )
                                          .map(
                                            ([_key, value]) =>
                                              `${_key}: ${Number(value)}`
                                          )
                                          .join(', ')
                                      : 'Empty'
                                  }`}
                                </Typography>
                              </React.Fragment>
                            }
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
                        <Divider variant="middle" component="li" />
                      </React.Fragment>
                    );
                  })
                )}
              </List>
            </Box>
          </Box>
          <Box>
            <Box mt={1} mb={1.5}>
              <Typography variant="h5">Forecast outputs</Typography>
              <Typography variant="body1">
                Indicate your output here. Highlight the formula cell you want
                to investigate as part of your model.
              </Typography>
            </Box>
            {activePane !== 'output' && (
              <Button
                variant="outlined"
                color="primary"
                loading="true"
                size="small"
                startIcon={<Add />}
                onClick={() => showOutputPane()}
                disabled={isSimulating}
              >
                Create
              </Button>
            )}
            {activePane === 'output' && (
              <OutputPane
                onHide={hidePane}
                onAccept={acceptVariable}
                appState={appState}
              />
            )}
            <Box mb={0.5} mt={0.2}>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                }}
              >
                {outputVariables.length === 0 ? (
                  <React.Fragment>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography
                            component="span"
                            variant="h6"
                            color="text.secondary"
                          >
                            [ Your first output will appear here ]
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider variant="middle" component="li" />
                  </React.Fragment>
                ) : (
                  outputVariables.map((item) => {
                    const { id, cellNotation, additionalData, sheetName } =
                      item;
                    return (
                      <React.Fragment key={id}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="h6"
                                color="text.primary"
                              >
                                {`${cellNotation}: ${additionalData.name}`}
                              </Typography>
                            }
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
                        <Divider variant="middle" component="li" />
                      </React.Fragment>
                    );
                  })
                )}
              </List>
            </Box>
          </Box>
          <Box mt={0.8}>
            <SimulationSettings
              numSimulationRuns={numSimulationRuns}
              setNumSimulationRuns={setNumSimulationRuns}
              isSimulating={isSimulating}
            />
          </Box>
          <Box mt={3}>
            {errorNotif && (
              <Box m={2}>
                <Alert severity="error">{errorNotif}</Alert>
              </Box>
            )}
            <Tooltip
              title="Input at least one input and one output to start a simulation"
              disableHoverListener={isReadyToSimulate}
            >
              <span
                style={{
                  cursor:
                    !isReadyToSimulate || isSimulating ? 'not-allowed' : 'auto',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
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
              </span>
            </Tooltip>
            <Button
              variant="text"
              color="error"
              size="small"
              disableElevation
              onClick={resetSimulation}
              style={{ marginLeft: '5px' }}
              disabled={isSimulating || !isReadyToSimulate}
            >
              Reset
            </Button>
          </Box>
          {!isSimulating && simulationResults && !errorNotif && (
            <Box mt={1.5}>
              <PresentOutputs
                results={simulationResults}
                showFullOutputClicked={showFullOutputClicked}
                setShowFullOutputClicked={setShowFullOutputClicked}
              />
            </Box>
          )}
          <Box mb={3}>
            {isSimulating ? (
              <Box mt={2} mb={2}>
                <Alert severity="info">
                  Currently there is no option to pause or stop the simulation
                  while running.
                </Alert>
                <Box mt={2} mb={2} />
                <Alert severity="warning">
                  Don&apos;t delete the newly created hidden sheet during
                  simulation, that&apos;s where your outputs will be presented.
                </Alert>
              </Box>
            ) : null}
          </Box>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default Main;
