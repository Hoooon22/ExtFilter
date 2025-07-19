package com.hoooon22.extfilter.repository;

import com.hoooon22.extfilter.entity.FixedExtension;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FixedExtensionRepository extends JpaRepository<FixedExtension, Long> {
    
    Optional<FixedExtension> findByName(String name);
    
    boolean existsByName(String name);
}