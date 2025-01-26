import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography, Box } from '@mui/material';

const NormalContinuous = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    const value = event.target.value.replace(',', '.');
    onInputChange({
      name: event.target.name,
      value: parseFloat(value),
      distributionType: 'normalContinuous',
      distributionName: 'Normal',
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Normal continuous
      </Typography>
      <TextField
        type="text"
        size="small"
        margin="dense"
        label="Mean"
        name="mean"
        inputProps={{ step: '0.00001' }}
        onChange={handleInputChange}
      />
      <TextField
        type="text"
        size="small"
        margin="dense"
        label="Std. dev."
        name="stdDev"
        inputProps={{ step: '0.00001' }}
        onChange={handleInputChange}
      />
    </Box>
  );
};

NormalContinuous.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default NormalContinuous;
