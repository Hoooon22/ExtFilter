package com.hoooon22.extfilter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FixedExtensionDto {
    
    private String name;
    private Boolean isBlocked;
}