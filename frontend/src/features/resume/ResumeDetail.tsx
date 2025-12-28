import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
  Grid,
  Avatar,
  Fade,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as LightbulbIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  TipsAndUpdates as TipsIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getResume, improveResume, reset } from './resumeSlice';

const ResumeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentResume, isLoading, isError, message, improvedContent, isSuccess } = useAppSelector(
    (state) => state.resume
  );

  useEffect(() => {
    if (isSuccess && improvedContent) {
      navigate(`/resume/${id}/editor`);
    }
  }, [isSuccess, improvedContent, navigate, id]);

  const handleImproveResume = () => {
    if (id) {
      dispatch(improveResume(id));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(getResume(id));
    }
  }, [dispatch, id]);

  const getATSScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getATSScoreColorHex = (score: number) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2 }} color="text.secondary">Loading analysis...</Typography>
        </Box>
      </Box>
    );
  }

  if (isError || !currentResume) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {message || 'Resume not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} variant="outlined">
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const { originalName, fileName, createdAt, fileType, analysis } = currentResume;

  return (
    <Container maxWidth="lg" sx={{ pb: 8 }}>
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mb: 2, borderRadius: 20, color: 'text.secondary' }}
            variant="text"
          >
            Back to Dashboard
          </Button>
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ color: '#1e293b', mb: 1 }}>
            Analysis Report
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {originalName} • {new Date(createdAt).toLocaleDateString()}
            <Chip
              label={fileType.toUpperCase()}
              size="small"
              sx={{
                ml: 2,
                px: 1,
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                color: 'primary.main',
                fontWeight: 'bold',
                borderRadius: 1
              }}
            />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => window.open(`http://localhost:5000/uploads/${fileName}`, '_blank')}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              py: 1.5,
              borderColor: 'rgba(99, 102, 241, 0.5)',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.05)',
                borderColor: 'primary.main',
              }
            }}
          >
            Original
          </Button>

          <Button
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PsychologyIcon />}
            onClick={handleImproveResume}
            disabled={isLoading}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
              py: 1.5,
              background: 'var(--primary-gradient)',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 20px rgba(99, 102, 241, 0.3)',
              }
            }}
          >
            {isLoading ? 'Improving Content...' : 'Improve with AI'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* ATS Score - Circular */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              height: '100%',
              borderRadius: 6,
              bgcolor: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom color="text.secondary">
              ATS Score
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex', my: 3 }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={160}
                thickness={4}
                sx={{ color: 'rgba(0,0,0,0.04)' }}
              />
              <CircularProgress
                variant="determinate"
                value={analysis.ats_score}
                size={160}
                thickness={4}
                sx={{
                  color: analysis.ats_score >= 80 ? '#10b981' :
                    analysis.ats_score >= 60 ? '#f59e0b' : '#ef4444',
                  position: 'absolute',
                  left: 0,
                  [`& .MuiCircularProgress-circle`]: {
                    strokeLinecap: 'round',
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h2" component="div" fontWeight="bold" color="#1e293b">
                  {analysis.ats_score}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  PERCENT
                </Typography>
              </Box>
            </Box>
            <Chip
              label={analysis.ats_score >= 80 ? "Perfect Match" : analysis.ats_score >= 60 ? "Good Match" : "Needs Work"}
              sx={{
                bgcolor: analysis.ats_score >= 80 ? 'rgba(16, 185, 129, 0.1)' :
                  analysis.ats_score >= 60 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: analysis.ats_score >= 80 ? '#10b981' :
                  analysis.ats_score >= 60 ? '#f59e0b' : '#ef4444',
                fontWeight: 'bold',
                borderRadius: 2,
                px: 1
              }}
            />
          </Paper>
        </Grid>

        {/* Summary */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: '100%',
              borderRadius: 6,
              bgcolor: 'white',
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' }}>
                <AssessmentIcon />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">Executive Summary</Typography>
            </Box>

            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#334155', mb: 4 }}>
              {analysis.overall_assessment}
            </Typography>

            <Divider sx={{ my: 4, opacity: 0.5 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
              Detailed Summary
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
              {analysis.summary}
            </Typography>
          </Paper>
        </Grid>

        {/* Strengths & Weaknesses */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: '100%',
              borderRadius: 6,
              bgcolor: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.12)',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#10b981', mb: 3 }}>
              <CheckCircleIcon />
              Key Strengths
            </Typography>
            <List>
              {analysis.strengths.map((strength: string, index: number) => (
                <ListItem key={index} sx={{ px: 0, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={strength}
                    primaryTypographyProps={{ variant: 'body2', lineHeight: 1.6, color: '#334155' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: '100%',
              borderRadius: 6,
              bgcolor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.12)',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#ef4444', mb: 3 }}>
              <ErrorIcon />
              Areas for Improvement
            </Typography>
            <List>
              {analysis.weaknesses.map((weakness: string, index: number) => (
                <ListItem key={index} sx={{ px: 0, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ef4444' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={weakness}
                    primaryTypographyProps={{ variant: 'body2', lineHeight: 1.6, color: '#334155' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Skills & Keywords */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 6,
              bgcolor: 'rgba(99, 102, 241, 0.02)',
              border: '1px solid rgba(99, 102, 241, 0.08)',
            }}
          >
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' }}>
                    <PsychologyIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">Skills Analysis</Typography>
                </Box>

                <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 2 }}>
                  TECHNICAL SKILLS
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
                  {analysis.skills.technical.map((skill: string, index: number) => (
                    <Chip
                      key={index}
                      label={skill}
                      sx={{
                        bgcolor: 'rgba(99, 102, 241, 0.05)',
                        color: 'primary.main',
                        fontWeight: 600,
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        borderRadius: 2
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 2 }}>
                  SOFT SKILLS
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {analysis.skills.soft.map((skill: string, index: number) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(0,0,0,0.1)',
                        color: 'text.secondary',
                        bgcolor: 'transparent',
                        borderRadius: 2
                      }}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    p: 4,
                    bgcolor: 'rgba(245, 158, 11, 0.05)',
                    borderRadius: 5,
                    height: '100%',
                    border: '1px dashed rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="#b45309" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Missing Keywords
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: '#92400e', lineHeight: 1.6 }}>
                    Include these keywords to better align with the job requirements:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {analysis.missing_keywords.map((keyword: string, index: number) => (
                      <Chip
                        key={index}
                        label={keyword}
                        size="small"
                        sx={{
                          bgcolor: 'white',
                          color: '#b45309',
                          fontWeight: 'bold',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                      />
                    ))}
                  </Box>
                  {analysis.missing_keywords.length === 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981' }}>
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2" fontWeight="bold">
                        Excellent keyword alignment
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Improvement Plan */}
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 6,
              bgcolor: 'rgba(59, 130, 246, 0.02)',
              border: '1px solid rgba(59, 130, 246, 0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
              <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' }}>
                <TipsIcon />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">Step-by-Step Improvement Plan</Typography>
            </Box>

            <Grid container spacing={3}>
              {analysis.improvement_suggestions.map((suggestion: string, index: number) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 4,
                      bgcolor: 'rgba(59, 130, 246, 0.04)',
                      border: '1px solid rgba(59, 130, 246, 0.08)',
                      display: 'flex',
                      gap: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary.light"
                      sx={{ opacity: 0.5, minWidth: 24 }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#334155' }}>
                      {suggestion}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResumeDetail;
