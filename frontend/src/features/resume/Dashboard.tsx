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
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          CareerAI Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Upload and analyze your resumes with AI to improve your job applications
        </Typography>
      </Box>

      {/* Stats Cards */}
      {resumes.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 2
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalResumes}
                  </Typography>
                  <Typography variant="body2">
                    Total Resumes
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <DescriptionIcon />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 2
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.avgATSScore}%
                  </Typography>
                  <Typography variant="body2">
                    Avg ATS Score
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <AssessmentIcon />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 2
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.recentResumes}
                  </Typography>
                  <Typography variant="body2">
                    This Week
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <ScheduleIcon />
                </Avatar>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<UploadIcon />}
          onClick={() => navigate('/upload')}
          sx={{ 
            px: 4, 
            py: 1.5,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
          }}
        >
          Upload New Resume
        </Button>
      </Box>

      {resumes.length === 0 ? (
        <Fade in timeout={1000}>
          <Paper
            elevation={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 8,
              px: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 80,
                height: 80,
                mb: 3,
              }}
            >
              <DescriptionIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" color="text.primary" gutterBottom fontWeight="bold">
              No resumes uploaded yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Upload your first resume to get started with AI-powered analysis and improve your job applications
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<UploadIcon />}
              onClick={() => navigate('/upload')}
              sx={{ 
                px: 4, 
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
              }}
            >
              Upload Resume
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Fade in timeout={800}>
          <Grid container spacing={3}>
            {resumes.map((resume, index) => (
              <Grid item xs={12} sm={6} md={4} key={resume._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {resume.fileType === 'pdf' ? 'PDF' : 'DOC'}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="h2" fontWeight="bold" noWrap>
                          {resume.originalName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {resume.fileType.toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" alignItems="center" mb={2}>
                      <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(resume.createdAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        {getATSScoreIcon(resume.analysis.ats_score)}
                        <LinearProgress 
                          variant="determinate" 
                          value={resume.analysis.ats_score}
                          sx={{ 
                            ml: 1, 
                            flex: 1,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor: resume.analysis.ats_score >= 80 ? 'success.main' : 
                                             resume.analysis.ats_score >= 60 ? 'warning.main' : 'error.main'
                            }
                          }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                          {resume.analysis.ats_score}%
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <WorkIcon sx={{ fontSize: 16, mr: 1 }} />
                          Skills: {resume.analysis.skills?.technical?.length || 0} technical, {resume.analysis.skills?.soft?.length || 0} soft
                        </Box>
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontStyle: 'italic',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {resume.analysis.summary}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Tooltip title="View detailed analysis">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewResume(resume._id)}
                        sx={{ flex: 1 }}
                      >
                        View
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete resume">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteResume(resume._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
