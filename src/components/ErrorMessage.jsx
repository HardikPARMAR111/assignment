import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

export const ErrorMessage = ({ message, onClose }) => (
  <Alert 
    severity="error" 
    onClose={onClose}
    className="mb-4"
  >
    <AlertTitle>Error</AlertTitle>
    {message}
  </Alert>
);