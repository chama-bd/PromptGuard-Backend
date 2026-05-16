package com.promptguard.api.repository;

import com.promptguard.api.model.PromptLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PromptLogRepository extends JpaRepository<PromptLog, UUID> {
    List<PromptLog> findAllByOrderByCreatedAtDesc();

    long countByStatus(com.promptguard.api.model.Status status);

    @Query("SELECT AVG(p.riskScore) FROM PromptLog p")
    Double getAverageRiskScore();

    @Query("SELECT p.department as department, COUNT(p) as count FROM PromptLog p WHERE p.status = 'BLOCKED' OR p.status = 'ANONYMIZED' GROUP BY p.department")
    List<Object[]> getRiskIncidentsByDepartment();
}
