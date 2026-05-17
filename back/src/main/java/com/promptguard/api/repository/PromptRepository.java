package com.promptguard.api.repository;

import com.promptguard.api.model.Prompt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PromptRepository extends JpaRepository<Prompt, UUID> {
    Page<Prompt> findByEmployeeId(UUID employeeId, Pageable pageable);

    @Query("SELECT AVG(p.riskScore) FROM Prompt p")
    Double getAverageRiskScore();

    @Query("SELECT p.dataTypes FROM Prompt p WHERE p.dataTypes IS NOT NULL AND p.dataTypes != ''")
    List<String> findAllDataTypes();
}
