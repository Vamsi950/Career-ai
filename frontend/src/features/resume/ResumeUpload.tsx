import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
  Avatar,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  TextField,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { uploadResume, reset } from './resumeSlice';

const ResumeUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { resumes, isLoading, isSuccess, isError, message, uploadProgress } = useAppSelector(
    (state) => state.resume
  );

  React.useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  React.useEffect(() => {
    if (isSuccess && resumes.length > 0) {
      navigate(`/resume/${resumes[0]._id}`);
      dispatch(reset());
    }
  }, [isSuccess, resumes, navigate, dispatch]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('jobDescription', jobDescription);

    dispatch(uploadResume(formData));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container maxWidth="md">
      <Fade in timeout={800}>
        <Box>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Back to Dashboard">
              <IconButton onClick={() => navigate('/')}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" sx={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Analyze Your Resume
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Get AI-powered insights tailored to your Job Description
              </Typography>
            </Box>
          </Box>

          {isError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
              {message}
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: dragActive ? '2px dashed #6366f1' : '2px dashed rgba(0,0,0,0.1)',
                  backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'rgba(99, 102, 241, 0.01)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 6,
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(99, 102, 241, 0.02)',
                  },
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />

                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: dragActive ? 'primary.main' : 'rgba(0,0,0,0.04)',
                      color: dragActive ? 'white' : 'text.secondary',
                      width: 100,
                      height: 100,
                      mx: 'auto',
                      mb: 4,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <UploadIcon sx={{ fontSize: 48 }} />
                  </Avatar>

                  <Typography variant="h5" gutterBottom fontWeight="bold" color={dragActive ? 'primary.main' : 'text.primary'}>
                    {dragActive ? 'Drop your file here' : 'Click or Drag Resume'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Supports PDF and DOCX (Max 5MB)
                  </Typography>

                  {selectedFile && (
                    <Fade in timeout={500}>
                      <Box
                        sx={{
                          mt: 2,
                          p: 2.5,
                          backgroundColor: 'rgba(76, 175, 80, 0.05)',
                          borderRadius: 3,
                          border: '1px solid rgba(76, 175, 80, 0.2)',
                          width: '100%',
                          maxWidth: 350
                        }}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={2}>
                            <CheckCircleIcon color="success" />
                            <Box sx={{ textAlign: 'left' }}>
                              <Typography variant="body2" fontWeight="bold" noWrap sx={{ maxWidth: 200 }}>
                                {selectedFile.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Ready for analysis
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Fade>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  bgcolor: 'white',
                  border: '1px solid rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DescriptionIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Job Description
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Paste the job description below for a targeted ATS score and tailored advice.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={12}
                  placeholder="Paste job description here..."
                  variant="outlined"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderRadius: 3,
                      '& fieldset': { borderColor: 'transparent' },
                      '&:hover fieldset': { borderColor: 'rgba(0,0,0,0.05)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    }
                  }}
                />
              </Paper>
            </Grid>
          </Grid>

          {isLoading && (
            <Fade in timeout={500}>
              <Paper elevation={3} sx={{ mt: 4, p: 3, borderRadius: 3, borderLeft: '6px solid', borderColor: 'primary.main' }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <SpeedIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Analyzing your profile...
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {uploadProgress < 30 ? 'Uploading files...' :
                    uploadProgress < 60 ? 'Extracting text...' :
                      uploadProgress < 90 ? 'Comparing with Job Description...' :
                        'Finalizing ATS Score...'}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: 'grey.100',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      background: 'var(--primary-gradient)',
                    }
                  }}
                />
              </Paper>
            </Fade>
          )}

          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="text"
              size="large"
              onClick={() => navigate('/')}
              sx={{ px: 4, borderRadius: 50, color: 'text.secondary' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              disabled={!selectedFile || isLoading}
              onClick={handleUpload}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 50,
                background: 'var(--primary-gradient)',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
                fontWeight: 'bold',
                '&:disabled': {
                  background: 'rgba(0,0,0,0.1)',
                },
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)',
                }
              }}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default ResumeUpload;
