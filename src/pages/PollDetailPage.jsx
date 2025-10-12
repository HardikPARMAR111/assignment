import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Box,
  Alert,
  Typography,
  Stack,
} from '@mui/material';
import { pollAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { FiArrowLeft } from 'react-icons/fi';

export const PollDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPollData();
  }, [id]);

  const fetchPollData = async () => {
    try {
      setLoading(true);
      const [pollRes, resultsRes, voteRes] = await Promise.all([
        pollAPI.getPollById(id),
        pollAPI.getPollResults(id),
        pollAPI.checkVote(id),
      ]);

      setPoll(pollRes.data.data);
      setResults(resultsRes.data.data.results);
      setHasVoted(voteRes.data.hasVoted);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    try {
      setVoting(true);
      await pollAPI.vote(id, selectedOption);
      setSuccessMessage('Vote recorded successfully!');
      setHasVoted(true);
      setSelectedOption('');
      
      setTimeout(() => {
        fetchPollData();
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!poll) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <ErrorMessage message="Poll not found" onClose={() => navigate('/')} />
      </Container>
    );
  }

  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Button
        startIcon={<FiArrowLeft />}
        onClick={() => navigate('/')}
        sx={{ mb: 4 }}
        variant="text"
      >
        Back to Polls
      </Button>

      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Card>
        <CardHeader
          title={poll.question}
          subheader={poll.description}
          titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
          subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary', mt: 1 }}
        />
        <CardContent>
          {!hasVoted && (
            <Box
              sx={{
                mb: 6,
                p: 3,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
              }}
            >
              <Typography variant="h6" mb={2}>
                Cast Your Vote
              </Typography>
              <RadioGroup
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                {poll.options.map((option) => (
                  <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio />}
                    label={<Typography fontWeight={500}>{option.text}</Typography>}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': { backgroundColor: 'action.hover' },
                      px: 1,
                    }}
                  />
                ))}
              </RadioGroup>
              <Button
                variant="contained"
                onClick={handleVote}
                disabled={voting || !selectedOption}
                fullWidth
                sx={{ mt: 3, height: 44 }}
              >
                {voting ? 'Recording Vote...' : 'Submit Vote'}
              </Button>
            </Box>
          )}

          {hasVoted && (
            <Alert severity="info" sx={{ mb: 4 }}>
              You have already voted on this poll. Here are the current results.
            </Alert>
          )}

          <Box>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Live Results
            </Typography>

            <Stack spacing={3}>
              {results.map((result) => (
                <Box key={result.id}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                      alignItems: 'flex-end',
                    }}
                  >
                    <Typography fontWeight={500} color="text.primary">
                      {result.text}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                      {result.votes} vote{result.votes !== 1 ? 's' : ''}{' '}
                      <Box component="span" color="primary.main" ml={1}>
                        ({result.percentage}%)
                      </Box>
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(result.percentage)}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: 'divider',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        backgroundColor: 'primary.main',
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              mt: 6,
              p: 3,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
            }}
          >
            <Stack direction="row" spacing={6}>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                  Total Votes
                </Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  {totalVotes}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                  Status
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {poll.isActive ? '🟢 Active' : '🔴 Closed'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};
