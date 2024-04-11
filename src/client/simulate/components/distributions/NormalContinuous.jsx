import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const NormalContinuous = ({ onInputChange }) => {
  const handleInputChange = (event) => {
    onInputChange({
      name: event.target.name,
      value: event.target.value,
      distributionType: 'normalContinuous',
    });
  };

  return (
    <div className="distr-inputs">
      <TextField
        type="number"
        size="small"
        label="Mean"
        name="mean"
        onChange={handleInputChange}
      />
      <TextField
        type="number"
        size="small"
        label="Std. Dev."
        name="stdDev"
        onChange={handleInputChange}
      />
    </div>
  );
};

NormalContinuous.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default NormalContinuous;
