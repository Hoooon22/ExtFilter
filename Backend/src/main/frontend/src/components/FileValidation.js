import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  TextField,
  Card,
  CardContent,
  IconButton,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle, Cancel, Delete, AttachFile } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const FileArea = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const FileValidation = () => {
  const [validationResults, setValidationResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // 기존 파일 목록에 새 파일들을 추가 (중복 제거)
      setSelectedFiles(prevFiles => {
        const newFiles = [...prevFiles];
        files.forEach(file => {
          if (!newFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
            newFiles.push(file);
          }
        });
        return newFiles;
      });
    }
  };

  const validateAllFiles = async () => {
    if (selectedFiles.length === 0) {
      showAlert('파일을 선택해주세요.', 'warning');
      return;
    }

    setLoading(true);
    setValidationResults([]);

    try {
      const results = [];
      for (const file of selectedFiles) {
        const response = await fetch('/api/validate/file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileName: file.name }),
        });

        const result = await response.json();
        results.push({
          fileName: file.name,
          fileSize: file.size,
          ...result
        });
      }
      
      setValidationResults(results);
      
      const validCount = results.filter(r => r.valid).length;
      const invalidCount = results.length - validCount;
      
      if (invalidCount === 0) {
        showAlert(`모든 파일(${validCount}개)이 업로드 가능합니다.`, 'success');
      } else if (validCount === 0) {
        showAlert(`모든 파일(${invalidCount}개)이 차단되었습니다.`, 'error');
      } else {
        showAlert(`${validCount}개 파일은 업로드 가능, ${invalidCount}개 파일은 차단되었습니다.`, 'info');
      }
    } catch (error) {
      showAlert('파일 검증 중 오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };


  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setValidationResults([]);
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setValidationResults([]);
    // 파일 입력 필드 초기화
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <Box>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom>
          파일 확장자 검증
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          파일을 선택하여 업로드 가능한 파일인지 확인하세요. (여러 파일 선택 가능)
        </Typography>

        {/* 파일 선택 영역 */}
        <FileArea 
          onClick={() => document.getElementById('file-input').click()}
          sx={{ mt: 2 }}
        >
          <input
            id="file-input"
            type="file"
            multiple
            hidden
            onChange={handleFileSelect}
          />
          <AttachFile sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            파일 선택
          </Typography>
          <Typography variant="body2" color="text.secondary">
            클릭하여 파일을 선택하세요 (여러 파일 선택 가능)
          </Typography>
        </FileArea>

        {/* 선택된 파일 목록 */}
        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">
                선택된 파일: {selectedFiles.length}개
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  onClick={validateAllFiles}
                  disabled={loading}
                  sx={{ mr: 1 }}
                >
                  {loading ? '검증 중...' : '모두 검증'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearAll}
                  size="small"
                >
                  모두 삭제
                </Button>
              </Box>
            </Box>
            
            {selectedFiles.map((file, index) => (
              <Card key={index} sx={{ mb: 1 }}>
                <CardContent sx={{ py: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2">
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => removeFile(index)} size="small">
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </StyledPaper>

      {/* 검증 결과 */}
      {validationResults.length > 0 && (
        <StyledPaper elevation={2}>
          <Typography variant="h6" gutterBottom>
            검증 결과
          </Typography>
          
          {validationResults.map((result, index) => (
            <Card key={index} sx={{ mb: 1 }}>
              <CardContent sx={{ py: 2 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  {result.valid ? (
                    <CheckCircle color="success" sx={{ fontSize: 30 }} />
                  ) : (
                    <Cancel color="error" sx={{ fontSize: 30 }} />
                  )}
                  
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} sx={{ mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {result.fileName}
                      </Typography>
                      <Chip
                        label={result.valid ? '업로드 가능' : '업로드 불가'}
                        color={result.valid ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {result.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      크기: {formatFileSize(result.fileSize)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </StyledPaper>
      )}
    </Box>
  );
};

export default FileValidation;