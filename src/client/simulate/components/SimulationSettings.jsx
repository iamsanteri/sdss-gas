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
          <Typography variant="h5" style={{ fontSize: '0.9rem' }}>
            Simulation settings
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl component="fieldset" size="small">
            <label>
              <Typography variant="h6" style={{ fontSize: '0.85rem' }}>
                Number of simulation runs
                <IconButton aria-label="info">
                  <Tooltip title="Simulation speed is limited by current compute and API limitations">
                    <InfoOutlinedIcon fontSize="small" color="action" />
                  </Tooltip>
                </IconButton>
              </Typography>
            </label>
            <RadioGroup
              aria-label="simulationRuns"
              value={numSimulationRuns}
              onChange={handleChange}
            >
              <FormControlLabel
                value="100"
                control={<Radio color="primary" />}
                label={
                  <Typography className="label-text">100 (Fast)</Typography>
                }
                disabled={isSimulating}
              />
              <FormControlLabel
                value="500"
                control={<Radio color="primary" />}
                label={
                  <Typography className="label-text">500 (Slow)</Typography>
                }
                disabled={isSimulating}
              />
              <FormControlLabel
                value="1000"
                control={<Radio color="primary" />}
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
          <Tooltip title="Defining correlations and improved outputs are planned in the future.">
            <div style={{ cursor: 'not-allowed' }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                disableElevation
                disabled
              >
                Define correlations
              </Button>
            </div>
          </Tooltip>
          <Box mt={2} mb={2} />
          <div>
            <FormControlLabel
              control={<Switch disabled />}
              label="Include sensitivity analysis"
              style={{ cursor: 'not-allowed' }}
            />
            <FormControlLabel
              control={<Switch disabled />}
              label="Include detailed analytics"
              style={{ cursor: 'not-allowed' }}
            />
          </div>
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
