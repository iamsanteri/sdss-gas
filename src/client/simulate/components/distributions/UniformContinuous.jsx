import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const UniformContinuous = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    onInputChange({
      name: event.target.name,
      value: event.target.value,
      distributionType: 'uniformContinuous',
    });
  };

  return (
    <div className="distr-inputs">
      <p>Uniform continuous</p>
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
        label="Max Value"
        name="max"
        onChange={handleInputChange}
      />
    </div>
  );
};

UniformContinuous.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default UniformContinuous;
