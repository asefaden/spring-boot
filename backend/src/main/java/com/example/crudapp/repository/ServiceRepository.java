package com.example.crudapp.repository;

import com.example.crudapp.model.CleaningService;
import org.springframework.data.jpa.repository.JpaRepository;

// ስሙን ወደ ServiceRepository ቀይረነዋል
public interface ServiceRepository extends JpaRepository<CleaningService, Long> {
}
