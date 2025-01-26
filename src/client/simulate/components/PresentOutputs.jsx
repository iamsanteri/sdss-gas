import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Tabs, Tab, Button, Box } from '@mui/material';

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

  return (
    <Box className="result-presentation">
      <Box ml={3} mr={3} mt={1} pt={1}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="fullWidth"
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
              <Box key={index} mt={2} mb={1} p={1}>
                <Grid container>
                  <Grid item xs={5}>
                    <Typography variant="h6" gutterBottom>
                      Value range:
                    </Typography>
                    <Typography variant="h6">Mean:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="h6" gutterBottom>
                      {`${Number(result.min.toFixed(2))} – ${Number(
                        result.max.toFixed(2)
                      )}`}
                    </Typography>
                    <Typography variant="h6">
                      {Number(result.mean.toFixed(2))}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )
        )}
      </Box>
      <Box ml={3} mr={3} pb={2}>
        <Button
          color="primary"
          onClick={() => viewOutputs()}
          disabled={showFullOutputClicked}
        >
          Go to full output
        </Button>
      </Box>
    </Box>
  );
};

PresentOutputs.propTypes = {
  results: PropTypes.array.isRequired,
  showFullOutputClicked: PropTypes.bool.isRequired,
  setShowFullOutputClicked: PropTypes.func.isRequired,
};

export default PresentOutputs;
