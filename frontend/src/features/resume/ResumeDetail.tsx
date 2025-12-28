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
  Divider,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  ArrowBack as ArrowBackIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getResume } from './resumeSlice';

const ResumeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentResume, isLoading, isError, message } = useAppSelector(
    (state) => state.resume
  );

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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !currentResume) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 3 }}>
          {message || 'Resume not found'}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const { originalName, createdAt, fileType, analysis } = currentResume;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Resume Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {originalName} • Uploaded: {new Date(createdAt).toLocaleDateString()} • {fileType.toUpperCase()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ATS Score */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              ATS Compatibility Score
            </Typography>
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={analysis.ats_score}
                sx={{ height: 10, borderRadius: 5 }}
                color={getATSScoreColor(analysis.ats_score)}
              />
            </Box>
            <Typography variant="h4" color={getATSScoreColor(analysis.ats_score)}>
              {analysis.ats_score}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {analysis.ats_score >= 80
                ? 'Excellent! Your resume is well-optimized for ATS systems.'
                : analysis.ats_score >= 60
                ? 'Good! Some improvements could help ATS compatibility.'
                : 'Needs improvement. Consider optimizing for ATS systems.'}
            </Typography>
          </Paper>
        </Grid>

        {/* Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography variant="body2">
              {analysis.summary}
            </Typography>
          </Paper>
        </Grid>

        {/* Strengths */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
              Strengths
            </Typography>
            <List dense>
              {analysis.strengths.map((strength: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${strength}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Weaknesses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingDownIcon sx={{ mr: 1, color: 'error.main' }} />
              Areas for Improvement
            </Typography>
            <List dense>
              {analysis.weaknesses.map((weakness: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={`• ${weakness}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Skills */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PsychologyIcon sx={{ mr: 1 }} />
              Skills
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Technical Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysis.skills.technical.map((skill: string, index: number) => (
                  <Chip key={index} label={skill} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Soft Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysis.skills.soft.map((skill: string, index: number) => (
                  <Chip key={index} label={skill} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Missing Keywords */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Missing Keywords
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {analysis.missing_keywords.map((keyword: string, index: number) => (
                <Chip key={index} label={keyword} size="small" color="warning" />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Experience */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ mr: 1 }} />
              Experience
            </Typography>
            {analysis.experience.map((exp: any, index: number) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{exp.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.company} • {exp.duration}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {exp.description}
                </Typography>
                {index < analysis.experience.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Education */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1 }} />
              Education
            </Typography>
            {analysis.education.map((edu: any, index: number) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{edu.degree}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {edu.institution} • {edu.year}
                </Typography>
                {index < analysis.education.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Improvement Suggestions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LightbulbIcon sx={{ mr: 1 }} />
              Improvement Suggestions
            </Typography>
            <List>
              {analysis.improvement_suggestions.map((suggestion: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${suggestion}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Overall Assessment */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overall Assessment
            </Typography>
            <Typography variant="body1">
              {analysis.overall_assessment}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResumeDetail;
