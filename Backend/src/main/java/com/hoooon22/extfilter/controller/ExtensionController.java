package com.hoooon22.extfilter.controller;

import com.hoooon22.extfilter.dto.CustomExtensionDto;
import com.hoooon22.extfilter.dto.FixedExtensionDto;
import com.hoooon22.extfilter.service.ExtensionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/extensions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "https://extfilter.site"})
public class ExtensionController {
    
    private final ExtensionService extensionService;
    
    @GetMapping("/fixed")
    public ResponseEntity<List<FixedExtensionDto>> getAllFixedExtensions() {
        try {
            List<FixedExtensionDto> fixedExtensions = extensionService.getAllFixedExtensions();
            return ResponseEntity.ok(fixedExtensions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/custom")
    public ResponseEntity<List<CustomExtensionDto>> getAllCustomExtensions() {
        try {
            List<CustomExtensionDto> customExtensions = extensionService.getAllCustomExtensions();
            return ResponseEntity.ok(customExtensions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/fixed/{name}")
    public ResponseEntity<?> updateFixedExtension(
            @PathVariable String name,
            @RequestBody Map<String, Boolean> request) {
        try {
            Boolean isBlocked = request.get("isBlocked");
            if (isBlocked == null) {
                return ResponseEntity.badRequest().body("isBlocked 값이 필요합니다.");
            }
            
            FixedExtensionDto updated = extensionService.updateFixedExtension(name, isBlocked);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }
    
    @PostMapping("/custom")
    public ResponseEntity<?> addCustomExtension(@RequestBody CustomExtensionDto request) {
        try {
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("확장자 이름이 필요합니다.");
            }
            
            CustomExtensionDto created = extensionService.addCustomExtension(request.getName());
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }
    
    @DeleteMapping("/custom/{name}")
    public ResponseEntity<?> deleteCustomExtension(@PathVariable String name) {
        try {
            extensionService.deleteCustomExtension(name);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }
}