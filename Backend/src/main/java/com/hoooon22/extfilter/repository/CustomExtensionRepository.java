package com.hoooon22.extfilter.repository;

import com.hoooon22.extfilter.entity.CustomExtension;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomExtensionRepository extends JpaRepository<CustomExtension, Long> {
    
    Optional<CustomExtension> findByName(String name);
    
    boolean existsByName(String name);
    
    void deleteByName(String name);
    
    long countBy();
}