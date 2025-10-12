// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Poll API calls
export const pollAPI = {
  // Create poll
  createPoll: (pollData) => api.post('/polls', pollData),

  // Get all polls
  getAllPolls: () => api.get('/polls'),

  // Get single poll
  getPollById: (pollId) => api.get(`/polls/${pollId}`),

  // Get poll results
  getPollResults: (pollId) => api.get(`/polls/${pollId}/results`),

  // Vote on poll (UPDATED)
  vote: (pollId, optionId) => api.post(`/polls/${pollId}/vote`, { optionId }),

  // Check if user voted
  checkVote: (pollId) => api.get(`/polls/${pollId}/check-vote`),

  // Close poll (use PATCH)
  closePoll: (pollId) => api.patch(`/polls/${pollId}/close`),
};

export default api;
