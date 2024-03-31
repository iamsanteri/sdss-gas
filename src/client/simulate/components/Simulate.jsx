import React from 'react';
import { Button } from '@mui/material';
import { AccessAlarm } from '@mui/icons-material';

const About = () => (
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
    >
      Santerino
    </Button>
    <p>- Santeri Liukkonen</p>
  </div>
);

export default About;
