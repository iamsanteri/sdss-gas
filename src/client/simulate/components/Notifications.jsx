import React from 'react';
import PropTypes from 'prop-types';
import { Button, Snackbar, Alert } from '@mui/material';

const Notifications = ({ handleNotifClose, notifOpen, notifMessage }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={notifOpen}
      autoHideDuration={4000}
      onClose={handleNotifClose}
      action={
        <Button size="small" color="primary">
          CLOSE
        </Button>
      }
    >
      <Alert
        severity="error"
        variant="filled"
        sx={{ width: '100%' }}
        onClose={handleNotifClose}
      >
        {notifMessage}
      </Alert>
    </Snackbar>
  );
};

Notifications.propTypes = {
  notifOpen: PropTypes.bool.isRequired,
  notifMessage: PropTypes.string.isRequired,
  handleNotifClose: PropTypes.func.isRequired,
};

export default Notifications;
