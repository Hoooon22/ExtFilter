package com.hoooon22.extfilter.config;

import com.hoooon22.extfilter.service.ExtensionService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final ExtensionService extensionService;
    
    @Override
    public void run(String... args) throws Exception {
        extensionService.initializeFixedExtensions();
    }
}