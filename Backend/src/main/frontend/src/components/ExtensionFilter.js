import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Chip,
  Grid,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  minHeight: '40px',
}));

const ExtensionFilter = () => {
  const [fixedExtensions, setFixedExtensions] = useState([
    { name: 'bat', checked: false },
    { name: 'cmd', checked: false },
    { name: 'com', checked: false },
    { name: 'cpl', checked: false },
    { name: 'exe', checked: false },
    { name: 'scr', checked: false },
    { name: 'js', checked: false },
  ]);
  
  const [customExtensions, setCustomExtensions] = useState([]);
  const [newExtension, setNewExtension] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [loading, setLoading] = useState(false);

  const MAX_CUSTOM_EXTENSIONS = 200;
  const MAX_EXTENSION_LENGTH = 20;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fixedResponse, customResponse] = await Promise.all([
        fetch('/api/extensions/fixed'),
        fetch('/api/extensions/custom')
      ]);
      
      if (fixedResponse.ok && customResponse.ok) {
        const fixedData = await fixedResponse.json();
        const customData = await customResponse.json();
        
        // 고정 확장자 데이터 매핑
        const updatedFixedExtensions = fixedExtensions.map(ext => {
          const found = fixedData.find(item => item.name === ext.name);
          return found ? { ...ext, checked: found.isBlocked } : ext;
        });
        
        setFixedExtensions(updatedFixedExtensions);
        setCustomExtensions(customData.map(item => item.name));
      } else {
        throw new Error('데이터 로드 실패');
      }
    } catch (error) {
      showAlert('데이터 로드에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 3000);
  };

  const handleFixedExtensionChange = async (index, checked) => {
    const updatedExtensions = [...fixedExtensions];
    updatedExtensions[index].checked = checked;
    setFixedExtensions(updatedExtensions);

    try {
      const response = await fetch(`/api/extensions/fixed/${updatedExtensions[index].name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: checked })
      });
      
      if (response.ok) {
        showAlert(`${updatedExtensions[index].name} 확장자 설정이 저장되었습니다.`, 'success');
      } else {
        throw new Error('설정 저장 실패');
      }
    } catch (error) {
      updatedExtensions[index].checked = !checked;
      setFixedExtensions(updatedExtensions);
      showAlert('설정 저장에 실패했습니다.', 'error');
    }
  };

  const validateExtension = (extension) => {
    const trimmedExtension = extension.trim().toLowerCase();
    
    if (!trimmedExtension) {
      return { valid: false, message: '확장자를 입력해주세요.' };
    }
    
    if (trimmedExtension.length > MAX_EXTENSION_LENGTH) {
      return { valid: false, message: `확장자는 최대 ${MAX_EXTENSION_LENGTH}자까지 입력 가능합니다.` };
    }
    
    if (!/^[a-z0-9]+$/.test(trimmedExtension)) {
      return { valid: false, message: '확장자는 영문자와 숫자만 사용 가능합니다.' };
    }
    
    if (customExtensions.some(ext => ext.toLowerCase() === trimmedExtension)) {
      return { valid: false, message: '이미 추가된 확장자입니다.' };
    }
    
    if (fixedExtensions.some(ext => ext.name.toLowerCase() === trimmedExtension)) {
      return { valid: false, message: '고정 확장자는 커스텀 확장자로 추가할 수 없습니다.' };
    }
    
    return { valid: true, message: '' };
  };

  const handleAddCustomExtension = async () => {
    if (customExtensions.length >= MAX_CUSTOM_EXTENSIONS) {
      showAlert(`커스텀 확장자는 최대 ${MAX_CUSTOM_EXTENSIONS}개까지 추가 가능합니다.`, 'warning');
      return;
    }

    const validation = validateExtension(newExtension);
    if (!validation.valid) {
      showAlert(validation.message, 'warning');
      return;
    }

    const trimmedExtension = newExtension.trim().toLowerCase();
    
    try {
      const response = await fetch('/api/extensions/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedExtension })
      });
      
      if (response.ok) {
        setCustomExtensions([...customExtensions, trimmedExtension]);
        setNewExtension('');
        showAlert('커스텀 확장자가 추가되었습니다.', 'success');
      } else {
        const errorMessage = await response.text();
        showAlert(errorMessage || '확장자 추가에 실패했습니다.', 'error');
      }
    } catch (error) {
      showAlert('확장자 추가에 실패했습니다.', 'error');
    }
  };

  const handleRemoveCustomExtension = async (extensionToRemove) => {
    try {
      const response = await fetch(`/api/extensions/custom/${extensionToRemove}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCustomExtensions(customExtensions.filter(ext => ext !== extensionToRemove));
        showAlert('커스텀 확장자가 삭제되었습니다.', 'success');
      } else {
        const errorMessage = await response.text();
        showAlert(errorMessage || '확장자 삭제에 실패했습니다.', 'error');
      }
    } catch (error) {
      showAlert('확장자 삭제에 실패했습니다.', 'error');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddCustomExtension();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {alert.show && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* 고정 확장자 섹션 */}
      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom>
          고정 확장자 설정
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          자주 차단하는 위험한 파일 확장자들입니다. 필요에 따라 선택하여 차단하세요.
        </Typography>
        
        <FormGroup row sx={{ mt: 2 }}>
          {fixedExtensions.map((extension, index) => (
            <FormControlLabel
              key={extension.name}
              control={
                <Checkbox
                  checked={extension.checked}
                  onChange={(e) => handleFixedExtensionChange(index, e.target.checked)}
                />
              }
              label={extension.name}
            />
          ))}
        </FormGroup>
      </StyledPaper>

      {/* 커스텀 확장자 섹션 */}
      <StyledPaper elevation={2}>
        <Typography variant="h6" gutterBottom>
          커스텀 확장자 관리
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          사용자 정의 확장자를 추가하여 차단할 수 있습니다. (최대 {MAX_CUSTOM_EXTENSIONS}개)
        </Typography>

        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="확장자 입력"
              value={newExtension}
              onChange={(e) => setNewExtension(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="예: pdf, doc, zip"
              helperText={`${newExtension.length}/${MAX_EXTENSION_LENGTH}자`}
              inputProps={{ maxLength: MAX_EXTENSION_LENGTH }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              onClick={handleAddCustomExtension}
              disabled={customExtensions.length >= MAX_CUSTOM_EXTENSIONS || !newExtension.trim()}
              fullWidth
            >
              추가
            </Button>
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          추가된 커스텀 확장자: {customExtensions.length}/{MAX_CUSTOM_EXTENSIONS}개
        </Typography>

        <ChipContainer>
          {customExtensions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              추가된 커스텀 확장자가 없습니다.
            </Typography>
          ) : (
            customExtensions.map((extension) => (
              <Chip
                key={extension}
                label={extension}
                onDelete={() => handleRemoveCustomExtension(extension)}
                color="primary"
                variant="outlined"
              />
            ))
          )}
        </ChipContainer>
      </StyledPaper>
    </Box>
  );
};

export default ExtensionFilter;