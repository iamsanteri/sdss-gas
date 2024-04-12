import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  IconButton,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const SimulationRunsSelector = ({
  numSimulationRuns,
  setNumSimulationRuns,
}) => {
  const handleChange = (event) => {
    setNumSimulationRuns(Number(event.target.value));
  };

  return (
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
                    offset: [0, -50],
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
          control={<Radio />}
          label={<Typography className="label-text">100 (Fast)</Typography>}
        />
        <FormControlLabel
          value="500"
          control={<Radio />}
          label={<Typography className="label-text">500 (Slow)</Typography>}
        />
        <FormControlLabel
          value="1000"
          control={<Radio />}
          label={
            <Typography className="label-text">1000 (Very slow)</Typography>
          }
        />
      </RadioGroup>
    </FormControl>
  );
};

SimulationRunsSelector.propTypes = {
  numSimulationRuns: PropTypes.number.isRequired,
  setNumSimulationRuns: PropTypes.func.isRequired,
};

export default SimulationRunsSelector;
