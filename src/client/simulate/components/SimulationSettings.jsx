import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  Box,
  Button,
  IconButton,
  Typography,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SimulationRunsSelector = ({
  numSimulationRuns,
  setNumSimulationRuns,
  isSimulating,
}) => {
  const handleChange = (event) => {
    setNumSimulationRuns(Number(event.target.value));
  };

  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="additional-settings-content"
          id="additional-settings-header"
        >
          <Typography>Simulation settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset" size="small">
            <label>
              Number of simulation runs
              <IconButton aria-label="info">
                <Tooltip
                  title="Simulation speed is limited by compute and current API"
                  PopperProps={{
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, -180],
                        },
                      },
                    ],
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" color="action" />
                </Tooltip>
              </IconButton>
            </label>
            <RadioGroup
              aria-label="simulationRuns"
              value={numSimulationRuns}
              onChange={handleChange}
            >
              <FormControlLabel
                value="100"
                control={<Radio color="success" />}
                label={
                  <Typography className="label-text">100 (Fast)</Typography>
                }
                disabled={isSimulating}
              />
              <FormControlLabel
                value="500"
                control={<Radio color="success" />}
                label={
                  <Typography className="label-text">500 (Slow)</Typography>
                }
                disabled={isSimulating}
              />
              <FormControlLabel
                value="1000"
                control={<Radio color="success" />}
                label={
                  <Typography className="label-text">
                    1000 (Very slow)
                  </Typography>
                }
                disabled={isSimulating}
              />
            </RadioGroup>
          </FormControl>
          <Box mt={2} mb={2} />
          <Tooltip
            title="Sensitivity analysis and ability to define correlations will be available in the future."
            PopperProps={{
              popperOptions: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 60], // Change this to adjust the position
                    },
                  },
                ],
              },
            }}
          >
            <div style={{ cursor: 'not-allowed' }}>
              <FormControlLabel
                control={<Switch disabled />}
                label="Include sensitivity analysis"
              />
              <FormControlLabel
                control={<Switch disabled />}
                label="Generate detailed analytics"
              />
            </div>
            <Box mt={2} mb={2} />
            <div style={{ cursor: 'not-allowed' }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<AddIcon />}
                disableElevation
                disabled
              >
                Define correlations
              </Button>
            </div>
          </Tooltip>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

SimulationRunsSelector.propTypes = {
  numSimulationRuns: PropTypes.number.isRequired,
  setNumSimulationRuns: PropTypes.func.isRequired,
  isSimulating: PropTypes.bool.isRequired,
};

export default SimulationRunsSelector;
