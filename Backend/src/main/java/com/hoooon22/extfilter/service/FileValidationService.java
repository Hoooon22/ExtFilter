package com.hoooon22.extfilter.service;

import com.hoooon22.extfilter.entity.CustomExtension;
import com.hoooon22.extfilter.entity.FixedExtension;
import com.hoooon22.extfilter.repository.CustomExtensionRepository;
import com.hoooon22.extfilter.repository.FixedExtensionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FileValidationService {
    
    private final FixedExtensionRepository fixedExtensionRepository;
    private final CustomExtensionRepository customExtensionRepository;
    
    public boolean validateFileExtension(String fileName) {
        String extension = getFileExtension(fileName);
        
        if (extension.isEmpty()) {
            throw new RuntimeException("파일 확장자를 확인할 수 없습니다.");
        }
        
        // 고정 확장자 차단 여부 확인
        FixedExtension fixedExtension = fixedExtensionRepository.findByName(extension).orElse(null);
        if (fixedExtension != null && fixedExtension.getIsBlocked()) {
            return false;
        }
        
        // 커스텀 확장자 차단 여부 확인 (커스텀 확장자는 등록되면 자동으로 차단됨)
        CustomExtension customExtension = customExtensionRepository.findByName(extension).orElse(null);
        if (customExtension != null) {
            return false;
        }
        
        return true;
    }
    
    private String getFileExtension(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return "";
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
}