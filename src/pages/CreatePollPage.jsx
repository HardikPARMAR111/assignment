// src/pages/CreatePollPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
} from '@mui/material';
import { pollAPI } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';

export const CreatePollPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    question: '',
    description: '',
    options: ['', ''],
    expiresAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleQuestionChange = (e) => setFormData({ ...formData, question: e.target.value });
  const handleDescriptionChange = (e) => setFormData({ ...formData, description: e.target.value });
  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };
  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData({ ...formData, options: [...formData.options, ''] });
    }
  };
  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };
  const handleExpiryChange = (e) => setFormData({ ...formData, expiresAt: e.target.value });

  const validateForm = () => {
    if (!formData.question.trim()) {
      setError('Question is required');
      return false;
    }
    if (formData.question.length < 5) {
      setError('Question must be at least 5 characters');
      return false;
    }
    const filledOptions = formData.options.filter(opt => opt.trim());
    if (filledOptions.length < 2) {
      setError('At least 2 options are required');
      return false;
    }
    if (formData.options.some(opt => opt.trim() === '')) {
      setError('All options must be filled or removed');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      const pollPayload = {
        question: formData.question,
        description: formData.description,
        options: formData.options,
        expiresAt: formData.expiresAt || null,
      };
      const response = await pollAPI.createPoll(pollPayload);
      setSuccessMessage('Poll created successfully!');
      setTimeout(() => navigate(`/poll/${response.data.data.id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  if (loading && successMessage) return <LoadingSpinner />;

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Button
        startIcon={<FiArrowLeft />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
        aria-label="Back to polls"
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
          title={<Typography variant="h5" fontWeight="bold">Create a New Poll</Typography>}
          subheader="Ask a question and add options for people to vote on"
        />
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={4}>
              {/* Question */}
              <TextField
                label="Poll Question"
                placeholder="What is your favorite programming language?"
                value={formData.question}
                onChange={handleQuestionChange}
                multiline
                rows={2}
                variant="outlined"
                fullWidth
                required
                helperText={`${formData.question.length}/500 characters`}
                inputProps={{ maxLength: 500 }}
              />

              {/* Description */}
              <TextField
                label="Description (Optional)"
                placeholder="Provide more context about your poll"
                value={formData.description}
                onChange={handleDescriptionChange}
                multiline
                rows={3}
                variant="outlined"
                fullWidth
              />

              {/* Options */}
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Poll Options
                </Typography>
                {formData.options.map((option, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <TextField
                      label={`Option ${index + 1}`}
                      placeholder="Enter option text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                    {formData.options.length > 2 && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeOption(index)}
                        aria-label={`Remove option ${index + 1}`}
                        sx={{ minWidth: 'auto', p: '10px' }}
                      >
                        <FiTrash2 />
                      </Button>
                    )}
                  </Stack>
                ))}

                {formData.options.length < 10 && (
                  <Button
                    variant="outlined"
                    startIcon={<FiPlus />}
                    onClick={addOption}
                    aria-label="Add new option"
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Option
                  </Button>
                )}
              </Stack>

              {/* Expiry */}
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Expiry Date (Optional)
                </Typography>
                <TextField
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={handleExpiryChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  fullWidth
                />
              </Stack>

              {/* Actions */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? 'Creating Poll...' : 'Create Poll'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Tips Box */}
      <Card sx={{ mt: 4, bgcolor: 'blue.50', borderColor: 'blue.200', border: 1 }}>
        <CardContent>
          <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
            💡 Tips
          </Typography>
          <ul style={{ paddingLeft: 16, margin: 0, color: '#1565c0' }}>
            <li>Make your question clear and concise</li>
            <li>Add at least 2 options (up to 10)</li>
            <li>Each option should be unique</li>
            <li>Optionally set an expiry time for your poll</li>
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
};
