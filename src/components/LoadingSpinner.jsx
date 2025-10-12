import React from 'react';
import { CircularProgress, Box } from '@mui/material';

export const LoadingSpinner = () => (
  <Box className="flex justify-center items-center min-h-[400px]">
    <CircularProgress />
  </Box>
);