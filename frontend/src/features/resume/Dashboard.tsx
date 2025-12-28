import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import {
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  UploadFile as UploadIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getResumes, deleteResume } from './resumeSlice';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { resumes, isLoading, isError, message } = useAppSelector(
    (state) => state.resume
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getResumes());
  }, [dispatch]);

  const handleViewResume = (id: string) => {
    navigate(`/resume/${id}`);
  };

  const handleDeleteResume = (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      dispatch(deleteResume(id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getATSScoreIcon = (score: number) => {
    if (score >= 80) return <StarIcon sx={{ color: 'success.main' }} />;
    if (score >= 60) return <AssessmentIcon sx={{ color: 'warning.main' }} />;
    return <TrendingUpIcon sx={{ color: 'error.main' }} />;
  };

  const getStats = () => {
    const totalResumes = resumes.length;
    const avgATSScore = totalResumes > 0
      ? Math.round(resumes.reduce((sum, r) => sum + r.analysis.ats_score, 0) / totalResumes)
      : 0;
    const recentResumes = resumes.filter(r => {
      const uploadDate = new Date(r.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    }).length;

    return { totalResumes, avgATSScore, recentResumes };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ color: '#0f172a' }}>
          Welcome back, {user?.name.split(' ')[0]}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Monitor your career progress and optimize your resumes.
        </Typography>
      </Box>

      {/* Stats Cards */}
      {resumes.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'rgba(99, 102, 241, 0.03)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main', width: 56, height: 56 }}>
                <DescriptionIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#0f172a">
                  {stats.totalResumes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Resumes
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'rgba(236, 72, 153, 0.03)',
                border: '1px solid rgba(236, 72, 153, 0.1)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <Avatar sx={{ bgcolor: 'rgba(236, 72, 153, 0.1)', color: 'secondary.main', width: 56, height: 56 }}>
                <AssessmentIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#0f172a">
                  {stats.avgATSScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg ATS Score
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: 'rgba(245, 158, 11, 0.03)',
                border: '1px solid rgba(245, 158, 11, 0.1)',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 3
              }}
            >
              <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: 56, height: 56 }}>
                <ScheduleIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="#0f172a">
                  {stats.recentResumes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Added This Week
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {message}
        </Alert>
      )}

      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">My Resumes</Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<UploadIcon />}
          onClick={() => navigate('/upload')}
          sx={{
            px: 4,
            py: 1.2,
            borderRadius: 50,
            background: 'var(--primary-gradient)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(99, 102, 241, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Upload New
        </Button>
      </Box>

      {resumes.length === 0 ? (
        <Fade in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 12,
              px: 4,
              borderRadius: 4,
              bgcolor: 'white',
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <Avatar
              sx={{
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'primary.main',
                width: 100,
                height: 100,
                mb: 4,
              }}
            >
              <DescriptionIcon sx={{ fontSize: 48 }} />
            </Avatar>
            <Typography variant="h4" color="text.primary" gutterBottom fontWeight="bold">
              No resumes yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center', maxWidth: 400 }}>
              Upload your resume to get AI-powered insights and keyword analysis.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<UploadIcon />}
              onClick={() => navigate('/upload')}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 50,
                background: 'var(--primary-gradient)',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
              }}
            >
              Get Started
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Fade in timeout={800}>
          <Grid container spacing={3}>
            {resumes.map((resume, index) => (
              <Grid item xs={12} sm={6} md={4} key={resume._id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 20px -10px rgba(0,0,0,0.1)',
                      borderColor: 'primary.light',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2.5}>
                      <Avatar sx={{
                        background: resume.fileType === 'pdf' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: resume.fileType === 'pdf' ? '#ef4444' : '#3b82f6',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        mr: 2
                      }}>
                        {resume.fileType.toUpperCase()}
                      </Avatar>
                      <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="h6" component="h2" fontWeight="bold" noWrap>
                          {resume.originalName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ref: {resume._id.slice(-6).toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" mb={3}>
                      <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Uploaded {formatDate(resume.createdAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" fontWeight="600">ATS Score</Typography>
                        <Typography variant="body2" fontWeight="bold" color={getATSScoreColor(resume.analysis.ats_score) + '.main'}>
                          {resume.analysis.ats_score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={resume.analysis.ats_score}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(0,0,0,0.04)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: resume.analysis.ats_score >= 80 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                              resume.analysis.ats_score >= 60 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                                'linear-gradient(90deg, #ef4444, #f87171)'
                          }
                        }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 1
                    }}>
                      {resume.analysis.summary}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewResume(resume._id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: 'rgba(0,0,0,0.1)',
                        color: '#1e293b'
                      }}
                    >
                      View Report
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteResume(resume._id)}
                      sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: 'rgba(239,68,68,0.05)' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
    </Container>
  );
};

export default Dashboard;
