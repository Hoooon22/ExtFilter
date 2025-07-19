package com.hoooon22.extfilter.controller;

import com.hoooon22.extfilter.service.FileValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/validate")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://extfilter.site"})
public class FileValidationController {
    
    private final FileValidationService fileValidationService;
    
    @PostMapping("/file")
    public ResponseEntity<Map<String, Object>> validateFile(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String fileName = request.get("fileName");
            if (fileName == null || fileName.trim().isEmpty()) {
                response.put("valid", false);
                response.put("message", "파일 이름을 입력해주세요.");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean isValid = fileValidationService.validateFileExtension(fileName);
            
            if (isValid) {
                response.put("valid", true);
                response.put("message", "업로드 가능한 파일입니다.");
            } else {
                response.put("valid", false);
                response.put("message", "차단된 파일 확장자입니다.");
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("valid", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}