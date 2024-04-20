import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography, Box, FormControl } from '@mui/material';

const TriangularContinuous = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    onInputChange({
      name: event.target.name,
      value: event.target.value,
      distributionType: 'triangularContinuous',
      distributionName: 'Triangular',
    });
  };

  return (
    <Box>
      <Typography variant="h5">Triangular continuous</Typography>
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
          label="Mode value"
          name="mode"
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

TriangularContinuous.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default TriangularContinuous;
