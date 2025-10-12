
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { PollDetailPage } from './pages/PollDetailPage';
import { CreatePollPage } from './pages/CreatePollPage';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6',
    },
    secondary: {
      main: '#8B5CF6',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/poll/:id" element={<PollDetailPage />} />
            <Route path="/create" element={<CreatePollPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;

