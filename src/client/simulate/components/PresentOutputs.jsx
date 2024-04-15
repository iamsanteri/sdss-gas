import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Tabs,
  Tab,
  Button,
  Box,
  ThemeProvider,
  createTheme,
  Alert,
} from '@mui/material';

import { serverFunctions } from '../../utils/serverFunctions';

const PresentOutputs = ({
  results,
  showFullOutputClicked,
  setShowFullOutputClicked,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const viewOutputs = () => {
    serverFunctions.goToSimulationOutputSheet();
    setShowFullOutputClicked(true);
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#2e7d32', // replace with your color
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Box mt={2} mb={2}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
          >
            {results.map((result, index) => (
              <Tab label={result.name} key={index} />
            ))}
          </Tabs>
          {results.map(
            (result, index) =>
              selectedTab === index && (
                <div key={index}>
                  <p>Min: {Number(result.min.toFixed(2))}</p>
                  <p>Max: {Number(result.max.toFixed(2))}</p>
                  <p>Mean: {Number(result.mean.toFixed(2))}</p>
                </div>
              )
          )}
        </Box>
        <Button
          color="success"
          onClick={() => viewOutputs()}
          disabled={showFullOutputClicked}
        >
          Go to full output
        </Button>
        <Box mt={2} mb={2}>
          <Alert severity="info">Improved analytics are planned.</Alert>
        </Box>
      </div>
    </ThemeProvider>
  );
};

PresentOutputs.propTypes = {
  results: PropTypes.array.isRequired,
  showFullOutputClicked: PropTypes.bool.isRequired,
  setShowFullOutputClicked: PropTypes.func.isRequired,
};

export default PresentOutputs;
