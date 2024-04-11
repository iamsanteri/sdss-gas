import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const TriangularContinuous = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    onInputChange({
      name: event.target.name,
      value: event.target.value,
      distributionType: 'triangularContinuous',
    });
  };

  return (
    <div className="distr-inputs">
      <TextField
        type="number"
        size="small"
        label="Min Value"
        name="min"
        onChange={handleInputChange}
      />
      <TextField
        type="number"
        size="small"
        label="Mode Value"
        name="mode"
        onChange={handleInputChange}
      />
      <TextField
        type="number"
        size="small"
        label="Max Value"
        name="max"
        onChange={handleInputChange}
      />
    </div>
  );
};

TriangularContinuous.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default TriangularContinuous;
