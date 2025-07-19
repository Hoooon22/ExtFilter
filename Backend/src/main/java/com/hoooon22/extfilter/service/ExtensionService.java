package com.hoooon22.extfilter.service;

import com.hoooon22.extfilter.dto.CustomExtensionDto;
import com.hoooon22.extfilter.dto.FixedExtensionDto;
import com.hoooon22.extfilter.entity.CustomExtension;
import com.hoooon22.extfilter.entity.FixedExtension;
import com.hoooon22.extfilter.repository.CustomExtensionRepository;
import com.hoooon22.extfilter.repository.FixedExtensionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ExtensionService {
    
    private final FixedExtensionRepository fixedExtensionRepository;
    private final CustomExtensionRepository customExtensionRepository;
    
    private static final int MAX_CUSTOM_EXTENSIONS = 200;
    private static final int MAX_EXTENSION_LENGTH = 20;
    
    @Transactional(readOnly = true)
    public List<FixedExtensionDto> getAllFixedExtensions() {
        return fixedExtensionRepository.findAll().stream()
                .map(this::convertToFixedExtensionDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<CustomExtensionDto> getAllCustomExtensions() {
        return customExtensionRepository.findAll().stream()
                .map(this::convertToCustomExtensionDto)
                .collect(Collectors.toList());
    }
    
    public FixedExtensionDto updateFixedExtension(String name, Boolean isBlocked) {
        FixedExtension fixedExtension = fixedExtensionRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("고정 확장자를 찾을 수 없습니다: " + name));
        
        fixedExtension.setIsBlocked(isBlocked);
        FixedExtension saved = fixedExtensionRepository.save(fixedExtension);
        return convertToFixedExtensionDto(saved);
    }
    
    public CustomExtensionDto addCustomExtension(String name) {
        String normalizedName = name.trim().toLowerCase();
        
        // 유효성 검사
        validateCustomExtension(normalizedName);
        
        // 중복 확인
        if (customExtensionRepository.existsByName(normalizedName)) {
            throw new RuntimeException("이미 존재하는 커스텀 확장자입니다: " + normalizedName);
        }
        
        // 고정 확장자와 중복 확인
        if (fixedExtensionRepository.existsByName(normalizedName)) {
            throw new RuntimeException("고정 확장자는 커스텀 확장자로 추가할 수 없습니다: " + normalizedName);
        }
        
        // 최대 개수 확인
        if (customExtensionRepository.countBy() >= MAX_CUSTOM_EXTENSIONS) {
            throw new RuntimeException("커스텀 확장자는 최대 " + MAX_CUSTOM_EXTENSIONS + "개까지 추가 가능합니다.");
        }
        
        CustomExtension customExtension = new CustomExtension(normalizedName);
        CustomExtension saved = customExtensionRepository.save(customExtension);
        return convertToCustomExtensionDto(saved);
    }
    
    public void deleteCustomExtension(String name) {
        String normalizedName = name.trim().toLowerCase();
        
        if (!customExtensionRepository.existsByName(normalizedName)) {
            throw new RuntimeException("커스텀 확장자를 찾을 수 없습니다: " + normalizedName);
        }
        
        customExtensionRepository.deleteByName(normalizedName);
    }
    
    private void validateCustomExtension(String name) {
        if (name == null || name.isEmpty()) {
            throw new RuntimeException("확장자 이름을 입력해주세요.");
        }
        
        if (name.length() > MAX_EXTENSION_LENGTH) {
            throw new RuntimeException("확장자는 최대 " + MAX_EXTENSION_LENGTH + "자까지 입력 가능합니다.");
        }
        
        if (!name.matches("^[a-z0-9]+$")) {
            throw new RuntimeException("확장자는 영문자와 숫자만 사용 가능합니다.");
        }
    }
    
    private FixedExtensionDto convertToFixedExtensionDto(FixedExtension entity) {
        return new FixedExtensionDto(entity.getName(), entity.getIsBlocked());
    }
    
    private CustomExtensionDto convertToCustomExtensionDto(CustomExtension entity) {
        return new CustomExtensionDto(entity.getName());
    }
    
    public void initializeFixedExtensions() {
        String[] fixedExtensionNames = {"bat", "cmd", "com", "cpl", "exe", "scr", "js"};
        
        for (String name : fixedExtensionNames) {
            if (!fixedExtensionRepository.existsByName(name)) {
                FixedExtension fixedExtension = new FixedExtension(name, false);
                fixedExtensionRepository.save(fixedExtension);
            }
        }
    }
}