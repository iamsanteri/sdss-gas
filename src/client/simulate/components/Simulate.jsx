import React, { useState } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';

import { Add, Delete } from '@mui/icons-material';

import InputPane from './InputPane';

import { serverFunctions } from '../../utils/serverFunctions';

// This is a wrapper for google.script.run that lets us use promises.
// import { serverFunctions } from '../../utils/serverFunctions';

const Simulate = () => {
  const [isInputPaneVisible, setInputPaneVisible] = useState(false);
  const [inputs, setInputs] = useState([]);

  const showInputPane = () => {
    setInputPaneVisible(true);
  };

  const hideInputPane = () => {
    setInputPaneVisible(false);
  };

  const acceptInput = (input) => {
    setInputs((prevInputs) => [...prevInputs, input]);
    hideInputPane();
  };

  const deleteInput = (index) => {
    serverFunctions.clearCellColor(inputs[index]);
    setInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
  };

  // serverFunctions.testSimulate();
  return (
    <div>
      {isInputPaneVisible ? (
        <InputPane onHide={hideInputPane} onAccept={acceptInput} />
      ) : (
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<Add />}
          disableElevation
          onClick={() => showInputPane()}
        >
          Create input
        </Button>
      )}
      <List>
        {inputs.map((input, index) => (
          <ListItem key={index}>
            <ListItemText primary={input} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteInput(index)}
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Simulate;
