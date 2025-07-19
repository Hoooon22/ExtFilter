import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExtensionFilter from './components/ExtensionFilter';
import FileValidation from './components/FileValidation';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            파일 확장자 차단 관리
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            보안을 위해 위험한 파일 확장자를 차단하는 시스템입니다.
          </Typography>
          <ExtensionFilter />
          <FileValidation />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
