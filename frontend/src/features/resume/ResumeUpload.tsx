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
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading, isSuccess, isError, message, uploadProgress } = useAppSelector(
    (state) => state.resume
  );

  React.useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  React.useEffect(() => {
    if (isSuccess) {
      navigate('/');
      dispatch(reset());
    }
  }, [isSuccess, navigate, dispatch]);

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
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                Upload Resume
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Upload your resume to get AI-powered analysis and feedback
              </Typography>
            </Box>
          </Box>

          {isError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}

          <Paper
            elevation={6}
            sx={{
              p: 4,
              border: dragActive ? '3px dashed' : '3px solid',
              borderColor: dragActive ? 'primary.main' : 'grey.300',
              backgroundColor: dragActive 
                ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
                : 'background.paper',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              borderRadius: 3,
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-2px)',
                boxShadow: 8,
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
            
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Avatar
                sx={{
                  bgcolor: dragActive ? 'primary.main' : 'grey.200',
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <UploadIcon sx={{ fontSize: 40, color: dragActive ? 'white' : 'text.secondary' }} />
              </Avatar>
              
              <Typography variant="h5" gutterBottom fontWeight="bold" color={dragActive ? 'primary.main' : 'text.primary'}>
                {dragActive ? 'Drop your file here' : 'Drag and drop your resume here'}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" gutterBottom>
                or click to browse files
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                <Chip 
                  label="PDF" 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  icon={<DescriptionIcon />}
                />
                <Chip 
                  label="DOCX" 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  icon={<DescriptionIcon />}
                />
                <Chip 
                  label="Max 5MB" 
                  size="small" 
                  color="default" 
                  variant="outlined"
                />
              </Box>
            </Box>

            {selectedFile && (
              <Fade in timeout={500}>
                <Box 
                  sx={{ 
                    mt: 3, 
                    p: 3, 
                    backgroundColor: 'success.light',
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: 'success.main',
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <CheckCircleIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatFileSize(selectedFile.size)} • {selectedFile.type === 'application/pdf' ? 'PDF' : 'DOCX'}
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
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Fade>
            )}
          </Paper>

          {isLoading && (
            <Fade in timeout={500}>
              <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 2 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <SpeedIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Processing your resume...
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {uploadProgress < 30 ? 'Uploading file...' : 
                   uploadProgress < 60 ? 'Extracting text content...' :
                   uploadProgress < 90 ? 'Analyzing with AI...' :
                   'Generating insights...'}
                </Typography>
                
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress}
                  sx={{ 
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                    }
                  }}
                />
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {uploadProgress}% complete
                </Typography>
              </Paper>
            </Fade>
          )}

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              disabled={!selectedFile || isLoading}
              onClick={handleUpload}
              startIcon={isLoading ? <CircularProgress size={24} /> : <AssessmentIcon />}
              sx={{ 
                px: 4, 
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:disabled': {
                  background: 'grey.300',
                }
              }}
            >
              {isLoading ? 'Processing...' : 'Upload & Analyze'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
              disabled={isLoading}
              sx={{ px: 4, py: 1.5 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default ResumeUpload;
