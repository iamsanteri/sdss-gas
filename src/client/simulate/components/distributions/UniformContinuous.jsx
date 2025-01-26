import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography, Box, FormControl } from '@mui/material';

const UniformContinuous = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    const value = event.target.value.replace(',', '.');
    onInputChange({
      name: event.target.name,
      value: parseFloat(value),
      distributionType: 'uniformContinuous',
      distributionName: 'Uniform',
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Uniform continuous
      </Typography>
      <FormControl>
        <TextField
          type="text"
          size="small"
          margin="dense"
          label="Max value"
          name="max"
          inputProps={{ step: '0.00001' }}
          onChange={handleInputChange}
        />
        <TextField
          type="text"
          size="small"
          margin="dense"
          label="Min value"
          name="min"
          inputProps={{ step: '0.00001' }}
          onChange={handleInputChange}
        />
      </FormControl>
    </Box>
  );
};

UniformContinuous.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default UniformContinuous;
