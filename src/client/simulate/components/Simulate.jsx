import React from 'react';
import { Button } from '@mui/material';
import { AccessAlarm } from '@mui/icons-material';

// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';

const Simulate = () => {
  const printToConsole = () => {
    serverFunctions.testSimulate();
  };

  return (
    <div>
      <p>
        <b>☀️ This is simulate ☀️</b>
      </p>
      <p>Not sure if this updates in real time.</p>
      <p>Yes it does.</p>
      <Button
        variant="contained"
        size="small"
        startIcon={<AccessAlarm />}
        disableElevation
        onClick={() => printToConsole()}
      >
        Santerino
      </Button>
      <p>- Santeri Liukkonen</p>
    </div>
  );
};

export default Simulate;
