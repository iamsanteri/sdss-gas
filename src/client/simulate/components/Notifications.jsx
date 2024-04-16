import React from 'react';
import PropTypes from 'prop-types';
import { Button, Snackbar } from '@mui/material';

const Notifications = ({ handleNotifClose, notifOpen, notifMessage }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={notifOpen}
      onClose={handleNotifClose}
      message={notifMessage}
      autoHideDuration={4000}
      action={
        <Button size="small" color="primary" onClick={handleNotifClose}>
          CLOSE
        </Button>
      }
    />
  );
};

Notifications.propTypes = {
  notifOpen: PropTypes.bool.isRequired,
  notifMessage: PropTypes.string.isRequired,
  handleNotifClose: PropTypes.func.isRequired,
};

export default Notifications;
