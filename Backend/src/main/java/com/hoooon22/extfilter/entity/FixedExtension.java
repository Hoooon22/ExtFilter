package com.hoooon22.extfilter.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "fixed_extensions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FixedExtension {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, unique = true, length = 20)
    private String name;
    
    @Column(name = "is_blocked", nullable = false)
    private Boolean isBlocked = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    public FixedExtension(String name, Boolean isBlocked) {
        this.name = name;
        this.isBlocked = isBlocked;
    }
}