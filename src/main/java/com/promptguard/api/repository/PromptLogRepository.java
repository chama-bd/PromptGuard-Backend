package com.promptguard.api.repository;

import com.promptguard.api.model.PromptLog;
import com.promptguard.api.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PromptLogRepository extends JpaRepository<PromptLog, UUID> {

    List<PromptLog> findAllByOrderByCreatedAtDesc();

    long countByStatus(Status status);

    // CORRECTION : On va chercher le score dans l'entité Prompt associée
    @Query("SELECT AVG(pl.prompt.riskScore) FROM PromptLog pl")
    Double getAverageRiskScore();

    @Query("SELECT pl.department as department, COUNT(pl) FROM PromptLog pl WHERE pl.status = 'BLOCKED' OR pl.status = 'ANONYMIZED' GROUP BY pl.department")
    List<Object[]> getRiskIncidentsByDepartment();
}