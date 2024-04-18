import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography, Box } from '@mui/material';

const NormalContinuous = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    onInputChange({
      name: event.target.name,
      value: event.target.value,
      distributionType: 'normalContinuous',
    });
  };

  return (
    <Box>
      <Typography variant="h5">Normal continuous</Typography>
      <TextField
        type="number"
        size="small"
        margin="dense"
        label="Mean"
        name="mean"
        onChange={handleInputChange}
      />
      <TextField
        type="number"
        size="small"
        margin="dense"
        label="Std. dev."
        name="stdDev"
        onChange={handleInputChange}
      />
    </Box>
  );
};

NormalContinuous.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default NormalContinuous;
