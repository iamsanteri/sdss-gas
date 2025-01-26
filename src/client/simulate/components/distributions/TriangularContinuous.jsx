import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography, Box, FormControl } from '@mui/material';

const TriangularContinuous = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    const value = event.target.value.replace(',', '.');
    onInputChange({
      name: event.target.name,
      value: parseFloat(value),
      distributionType: 'triangularContinuous',
      distributionName: 'Triangular',
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Triangular continuous
      </Typography>
      <FormControl>
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Max value"
          name="max"
          inputProps={{ step: 'any' }}
          onChange={handleInputChange}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Mode value"
          name="mode"
          inputProps={{ step: 'any' }}
          onChange={handleInputChange}
        />
        <TextField
          type="number"
          size="small"
          margin="dense"
          label="Min value"
          name="min"
          inputProps={{ step: 'any' }}
          onChange={handleInputChange}
        />
      </FormControl>
    </Box>
  );
};

TriangularContinuous.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default TriangularContinuous;
