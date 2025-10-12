import React from 'react';
import { Card, CardContent, CardHeader, LinearProgress, Typography, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export const PollCard = ({ poll }) => {
  const navigate = useNavigate();
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);

  return (
    <Card
      onClick={() => navigate(`/poll/${poll.id}`)}
      sx={{
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: 6,
        },
        animation: 'fadeIn 0.5s',
      }}
      elevation={2}
    >
      <CardHeader
        title={poll.question}
        titleTypographyProps={{ variant: 'h6', fontWeight: 'medium' }}
      />
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {poll.description || 'No description provided'}
        </Typography>

        <Stack spacing={2}>
          {poll.options.slice(0, 2).map((option) => {
            const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;
            return (
              <Box key={option.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography fontWeight={500}>{option.text}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {percentage.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
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
            );
          })}
        </Stack>

        {poll.options.length > 2 && (
          <Typography
            variant="body2"
            color="primary"
            fontWeight="semibold"
            mt={3}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            View all {poll.options.length} options <FiArrowRight size={16} />
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary" mt={4} display="block">
          Total votes: <Box component="span" fontWeight="medium" color="text.primary">{totalVotes}</Box>
        </Typography>
      </CardContent>
    </Card>
  );
};
