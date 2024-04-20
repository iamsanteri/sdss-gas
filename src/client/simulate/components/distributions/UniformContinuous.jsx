import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography, Box, FormControl } from '@mui/material';

const UniformContinuous = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    onInputChange({
      name: event.target.name,
      value: event.target.value,
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
          type="number"
          size="small"
          margin="dense"
          label="Min value"
          name="min"
          onChange={handleInputChange}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Max value"
          name="max"
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
