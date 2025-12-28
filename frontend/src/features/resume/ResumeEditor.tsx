import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  TipsAndUpdates as TipsIcon,
  Article as ArticleIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { getResume } from './resumeSlice';

const ResumeEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentResume, improvedContent } = useAppSelector((state) => state.resume);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (id && (!currentResume || currentResume._id !== id)) {
      dispatch(getResume(id));
    }
  }, [dispatch, id, currentResume]);

  useEffect(() => {
    if (improvedContent) {
      setContent(improvedContent);
    } else if (currentResume) {
      setContent(currentResume.extractedText);
    }
  }, [improvedContent, currentResume]);

  const parseMarkdown = (text: string) => {
    let html = text;
    html = html.replace(/^#\s+(.+)$/gm, '<h2 class="section-title">$1</h2>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="link">$1</a>');
    return html;
  };

  const handleDownloadPDF = () => {
    if (!currentResume) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const formattedContent = parseMarkdown(content);
      const userEmail = currentResume.user?.email || 'saivamsi_pala@srmap.edu.in';
      const userName = 'Pala Sai Vamsi';

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume - ${userName}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
              body { 
                font-family: 'Inter', sans-serif; 
                padding: 0.6in; 
                line-height: 1.4;
                color: #111;
                max-width: 8.27in;
                margin: 0 auto;
                background: white;
              }
              .header { text-align: center; margin-bottom: 20px; }
              .name { font-size: 22pt; font-weight: 700; margin-bottom: 5px; }
              .contact-info { font-size: 10pt; color: #444; margin-bottom: 5px; }
              .contact-info a { color: #003399; text-decoration: none; }
              .section-title { 
                font-size: 12pt; font-weight: 700; text-transform: uppercase; 
                border-bottom: 1pt solid #000; margin-top: 15px; margin-bottom: 8px; 
                padding-bottom: 2px;
              }
              p, li { font-size: 10pt; margin-bottom: 2px; }
              ul { padding-left: 18px; margin-top: 2px; margin-bottom: 8px; }
              li { margin-bottom: 1px; }
              .link { color: #003399; text-decoration: none; }
              @media print { body { padding: 0.5in; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="name">${userName}</div>
              <div class="contact-info">West Godavari, Andhra Pradesh | +91-9505218598</div>
              <div class="contact-info">
                <a href="mailto:${userEmail}">${userEmail}</a> | 
                <a href="https://linkedin.com/in/saivamsipala">linkedin.com/in/saivamsi-pala</a> | 
                <a href="https://github.com/Vamsi950">github.com/Vamsi950</a>
              </div>
            </div>
            <div class="resume-body">${formattedContent}</div>
            <script>setTimeout(() => { window.print(); }, 500);</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (!currentResume) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Loading Resume Data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate(`/resume/${id}`)} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#0f172a' }}>Resume Editor</Typography>
            <Typography variant="body2" color="text.secondary">Refine and download your professional PDF.</Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPDF}
          sx={{
            borderRadius: 3, px: 4, py: 1.5,
            background: 'var(--primary-gradient)',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)',
            fontWeight: 'bold', textTransform: 'none'
          }}
        >
          Download PDF
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Grid size={{ xs: 12, lg: 3 }} sx={{ height: '100%', overflowY: 'auto' }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0', bgcolor: 'rgba(99, 102, 241, 0.02)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main', width: 32, height: 32 }}>
                <TipsIcon fontSize="small" />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">Suggestions</Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {currentResume.analysis.improvement_suggestions.map((s, i) => (
                <ListItem key={i} sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 24, mt: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText primary={s} primaryTypographyProps={{ variant: 'body2' }} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 9 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={0} sx={{ flexGrow: 1, borderRadius: 6, border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', gap: 2 }}>
              <ArticleIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">RESUME CONTENT</Typography>
            </Box>
            <TextField
              multiline fullWidth value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { p: 4, fontSize: '1.1rem', fontFamily: '"Inter", sans-serif', lineHeight: 1.8, color: '#0f172a', height: '100%', alignItems: 'flex-start' }
              }}
              sx={{ flexGrow: 1, overflowY: 'auto' }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResumeEditor;
