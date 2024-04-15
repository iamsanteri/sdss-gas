import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Tooltip, Typography } from '@mui/material';

import UniformContinuous from './distributions/UniformContinuous';
import TriangularContinuous from './distributions/TriangularContinuous';
import NormalContinuous from './distributions/NormalContinuous';

import { SDSSIcon1, SDSSIcon2, SDSSIcon3, SDSSIcon4 } from './icons/SdssIcons';

const DistrSelection = ({ onInputChange }) => {
  const [selectedDistr, setSelectedDistr] = useState(0);

  const handleDistrChange = (event, newValue) => {
    setSelectedDistr(newValue);
  };

  return (
    <div className="tabs-icons">
      <Tabs
        value={selectedDistr}
        onChange={handleDistrChange}
        aria-label="icon tabs example"
        variant="fullWidth"
        TabIndicatorProps={{
          style: {
            backgroundColor: selectedDistr === 3 ? 'lightgrey' : 'green',
          },
        }}
      >
        <Tooltip title="Uniform (continuous)">
          <Tab
            icon={<SDSSIcon2 />}
            aria-label="Uniform (continuous)"
            style={{
              minWidth: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Tooltip>
        <Tooltip title="Triangular (continuous)">
          <Tab
            icon={<SDSSIcon3 />}
            aria-label="Triangular (continuous)"
            style={{
              minWidth: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Tooltip>
        <Tooltip title="Normal (continuous)">
          <Tab
            icon={<SDSSIcon1 />}
            aria-label="Normal (continuous)"
            style={{
              minWidth: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Tooltip>
        <Tooltip title="More distributions (coming soon...)">
          <Tab
            icon={<SDSSIcon4 style={{ opacity: 0.5 }} />}
            aria-label="More distributions (coming soon...)"
            className="disabled-tab"
            style={{
              minWidth: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Tooltip>
      </Tabs>
      <Box mt={2}>
        {selectedDistr === 0 && (
          <UniformContinuous onInputChange={onInputChange} />
        )}
        {selectedDistr === 1 && (
          <TriangularContinuous onInputChange={onInputChange} />
        )}
        {selectedDistr === 2 && (
          <NormalContinuous onInputChange={onInputChange} />
        )}
        {selectedDistr === 3 && (
          <Typography variant="body1" sx={{ color: 'grey' }}>
            More distributions and discrete variants are planned in the future.
          </Typography>
        )}
      </Box>
    </div>
  );
};

DistrSelection.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default DistrSelection;
