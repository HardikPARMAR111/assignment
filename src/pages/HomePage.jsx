// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Pagination, Box } from '@mui/material';
import { pollAPI } from '../services/api';
import { PollCard } from '../components/pollCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const HomePage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPolls(page);
  }, [page]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await pollAPI.getAllPolls();
      console.log(response)
      setPolls(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load polls');
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="lg" className="py-8">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

      {polls.length === 0 ? (
        <Box className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">No Polls Available</h2>
          <p className="text-gray-500">Create the first poll to get started!</p>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {polls.map((poll) => (
              <Grid item xs={12} sm={6} md={4} key={poll.id}>
                <PollCard poll={poll} />
              </Grid>
            ))}
          </Grid>

         
        </>
      )}
    </Container>
  );
};