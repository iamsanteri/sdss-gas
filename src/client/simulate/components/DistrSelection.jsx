import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ButtonBase, Tooltip, Box } from '@mui/material';

import UniformContinuous from './distributions/UniformContinuous';
import TriangularContinuous from './distributions/TriangularContinuous';
import NormalContinuous from './distributions/NormalContinuous';

/* PLEASE NOTE THAT COPILOT GETS CONFUSED IN THIS COMPONENT DUE TO SVG BELOW */

const DistrSelection = ({ onInputChange }) => {
  const [selectedDistr, setSelectedDistr] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const handleDistrChange = (distr) => {
    setSelectedDistr(distr);
  };

  const handleClick = (id, distr) => {
    setActiveButton(id);
    handleDistrChange(distr);
  };

  const SDSSIcon1 = () => (
    <svg
      customName="NORMAL"
      className="sdss-icon"
      clipRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      viewBox="0 0 2048 2048"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g strokeLinecap="butt" strokeLinejoin="round">
        <g stroke="#000002" strokeWidth="20">
          <path d="m1699.02 375.982h-1350.039c-44.659 0-81.003 36.343-81.003 81.002v1134.036c0 44.66 36.344 81 81.003 81h1350.039c44.66 0 81-36.34 81-81v-1134.036c0-44.659-36.34-81.002-81-81.002zm27 1215.038c0 14.87-12.1 27-27 27h-1350.039c-14.905 0-27.001-12.13-27.001-27v-1134.036c0-14.878 12.096-27.001 27.001-27.001h1350.039c14.9 0 27 12.123 27 27.001z" />
          <path d="m1618.02 1537.01h-1215.038v-999.024c0-14.931 12.07-27.001 27.001-27.001 14.932 0 27.001 12.07 27.001 27.001v945.024h1161.036c14.93 0 27 12.07 27 27 0 14.94-12.07 27-27 27z" />
        </g>
        <path
          d="m470.322 1513.52c415.258 0 235.313-881.709 553.678-881.709 318.37 0 138.42 881.709 553.68 881.709"
          fill="none"
          stroke="#000"
          strokeWidth="67.1567"
        />
      </g>
    </svg>
  );

  const SDSSIcon2 = () => (
    <svg
      customName="UNIFORM"
      className="sdss-icon"
      clipRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      viewBox="0 0 2048 2048"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g strokeLinecap="butt" strokeLinejoin="round">
        <g stroke="#000002" strokeWidth="20">
          <path d="M1699.02 375.982L348.981 375.982C304.322 375.982 267.978 412.325 267.978 456.984L267.978 1591.02C267.978 1635.68 304.322 1672.02 348.981 1672.02L1699.02 1672.02C1743.68 1672.02 1780.02 1635.68 1780.02 1591.02L1780.02 456.984C1780.02 412.325 1743.68 375.982 1699.02 375.982ZM1726.02 1591.02C1726.02 1605.89 1713.92 1618.02 1699.02 1618.02L348.981 1618.02C334.076 1618.02 321.98 1605.89 321.98 1591.02L321.98 456.984C321.98 442.106 334.076 429.983 348.981 429.983L1699.02 429.983C1713.92 429.983 1726.02 442.106 1726.02 456.984L1726.02 1591.02Z" />
          <path d="M1618.02 1537.01L402.982 1537.01L402.982 537.986C402.982 523.055 415.052 510.985 429.983 510.985C444.915 510.985 456.984 523.055 456.984 537.986L456.984 1483.01L1618.02 1483.01C1632.95 1483.01 1645.02 1495.08 1645.02 1510.01C1645.02 1524.95 1632.95 1537.01 1618.02 1537.01Z" />
        </g>
        <path
          d="M785.333 661.824L1262.67 661.824L1262.67 1508.84L785.333 1508.84L785.333 661.824Z"
          fill="none"
          stroke="#000"
          strokeWidth="67.1567"
        />
      </g>
    </svg>
  );

  const SDSSIcon3 = () => (
    <svg
      customName="TRIANGULAR"
      className="sdss-icon"
      height="100%"
      strokeMiterlimit="10"
      style={{
        fillRule: 'nonzero',
        clipRule: 'evenodd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
      version="1.1"
      viewBox="0 0 2048 2048"
      width="100%"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="Layer-1">
        <g opacity="1">
          <path
            d="M1699.02 375.982L348.981 375.982C304.322 375.982 267.978 412.325 267.978 456.984L267.978 1591.02C267.978 1635.68 304.322 1672.02 348.981 1672.02L1699.02 1672.02C1743.68 1672.02 1780.02 1635.68 1780.02 1591.02L1780.02 456.984C1780.02 412.325 1743.68 375.982 1699.02 375.982ZM1726.02 1591.02C1726.02 1605.89 1713.92 1618.02 1699.02 1618.02L348.981 1618.02C334.076 1618.02 321.98 1605.89 321.98 1591.02L321.98 456.984C321.98 442.106 334.076 429.983 348.981 429.983L1699.02 429.983C1713.92 429.983 1726.02 442.106 1726.02 456.984L1726.02 1591.02Z"
            fill="#000000"
            fillRule="nonzero"
            opacity="1"
            stroke="#000002"
            strokeLinecap="butt"
            strokeLinejoin="round"
            strokeWidth="20"
          />
          <path
            d="M1618.02 1537.01L402.982 1537.01L402.982 537.986C402.982 523.055 415.052 510.985 429.983 510.985C444.915 510.985 456.984 523.055 456.984 537.986L456.984 1483.01L1618.02 1483.01C1632.95 1483.01 1645.02 1495.08 1645.02 1510.01C1645.02 1524.95 1632.95 1537.01 1618.02 1537.01Z"
            fill="#000000"
            fillRule="nonzero"
            opacity="1"
            stroke="#000002"
            strokeLinecap="butt"
            strokeLinejoin="round"
            strokeWidth="20"
          />
        </g>
        <path
          d="M1023.52 646.965L1229.08 1077.07L1434.65 1507.18L1024.07 1507.44L613.488 1507.7L818.503 1077.33L1023.52 646.965Z"
          fill="#3395ff"
          fillOpacity="0"
          fillRule="nonzero"
          opacity="1"
          stroke="#000000"
          strokeLinecap="butt"
          strokeLinejoin="round"
          strokeWidth="67.1567"
        />
      </g>
    </svg>
  );

  const SDSSIcon4 = () => (
    <svg
      customName="ADDITIONAL"
      className="sdss-icon"
      height="100%"
      strokeMiterlimit="10"
      style={{
        fillRule: 'nonzero',
        clipRule: 'evenodd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
      version="1.1"
      viewBox="0 0 2048 2048"
      width="100%"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="Layer-1">
        <g opacity="1">
          <path
            d="M1699.02 375.982L348.981 375.982C304.322 375.982 267.978 412.325 267.978 456.984L267.978 1591.02C267.978 1635.68 304.322 1672.02 348.981 1672.02L1699.02 1672.02C1743.68 1672.02 1780.02 1635.68 1780.02 1591.02L1780.02 456.984C1780.02 412.325 1743.68 375.982 1699.02 375.982ZM1726.02 1591.02C1726.02 1605.89 1713.92 1618.02 1699.02 1618.02L348.981 1618.02C334.076 1618.02 321.98 1605.89 321.98 1591.02L321.98 456.984C321.98 442.106 334.076 429.983 348.981 429.983L1699.02 429.983C1713.92 429.983 1726.02 442.106 1726.02 456.984L1726.02 1591.02Z"
            fill="#000000"
            fillRule="nonzero"
            opacity="1"
            stroke="#000002"
            strokeLinecap="butt"
            strokeLinejoin="round"
            strokeWidth="20"
          />
          <path
            d="M1618.02 1537.01L402.982 1537.01L402.982 537.986C402.982 523.055 415.052 510.985 429.983 510.985C444.915 510.985 456.984 523.055 456.984 537.986L456.984 1483.01L1618.02 1483.01C1632.95 1483.01 1645.02 1495.08 1645.02 1510.01C1645.02 1524.95 1632.95 1537.01 1618.02 1537.01Z"
            fill="#000000"
            fillRule="nonzero"
            opacity="1"
            stroke="#000002"
            strokeLinecap="butt"
            strokeLinejoin="round"
            strokeWidth="20"
          />
        </g>
        <g opacity="1">
          <path
            d="M1024 757.333L1024 1290.67M1290.67 1024L757.333 1024"
            fill="none"
            opacity="1"
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="miter"
            strokeWidth="60.3501"
          />
        </g>
      </g>
    </svg>
  );

  return (
    <div>
      <Tooltip title="Uniform (continuous)">
        <ButtonBase
          onClick={() => handleClick(1, 'uniformContinuous')}
          style={{
            backgroundColor: activeButton === 1 ? 'lightgray' : 'white',
          }}
        >
          <SDSSIcon2 />
        </ButtonBase>
      </Tooltip>
      <Tooltip title="Triangular (continuous)">
        <ButtonBase
          onClick={() => handleClick(2, 'triangularContinuous')}
          style={{
            backgroundColor: activeButton === 2 ? 'lightgray' : 'white',
          }}
        >
          <SDSSIcon3 />
        </ButtonBase>
      </Tooltip>
      <Tooltip title="Normal (continuous)">
        <ButtonBase
          onClick={() => handleClick(3, 'normalContinuous')}
          style={{
            backgroundColor: activeButton === 3 ? 'lightgray' : 'white',
          }}
        >
          <SDSSIcon1 />
        </ButtonBase>
      </Tooltip>
      <Tooltip title="More distributions (coming soon...)">
        <ButtonBase
          style={{
            opacity: 0.5,
            backgroundColor: 'white',
            cursor: 'not-allowed',
          }}
        >
          <SDSSIcon4 />
        </ButtonBase>
      </Tooltip>
      <Box mt={2} mb={2} />
      {selectedDistr === 'uniformContinuous' && (
        <UniformContinuous onInputChange={onInputChange} />
      )}
      {selectedDistr === 'triangularContinuous' && (
        <TriangularContinuous onInputChange={onInputChange} />
      )}
      {selectedDistr === 'normalContinuous' && (
        <NormalContinuous onInputChange={onInputChange} />
      )}
    </div>
  );
};

DistrSelection.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default DistrSelection;
