package com.promptguard.api.repository;

import com.promptguard.api.model.PromptLog;
import com.promptguard.api.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public interface PromptLogRepository extends JpaRepository<PromptLog, UUID> {

    @Query("SELECT pl FROM PromptLog pl JOIN FETCH pl.prompt ORDER BY pl.createdAt DESC")
    List<PromptLog> findAllWithPromptOrderByCreatedAtDesc();

    @Query("SELECT pl FROM PromptLog pl JOIN FETCH pl.prompt WHERE pl.id = :id")
    PromptLog findByIdWithPrompt(UUID id);

    long countByStatus(Status status);

    // CORRECTION : On va chercher le score dans l'entité Prompt associée
    @Query("SELECT AVG(pl.prompt.riskScore) FROM PromptLog pl")
    Double getAverageRiskScore();

    @Query("SELECT pl.department as department, COUNT(pl) FROM PromptLog pl WHERE pl.status = 'BLOCKED' OR pl.status = 'ANONYMIZED' GROUP BY pl.department")
    List<Object[]> getRiskIncidentsByDepartment();

    @Query(value = "SELECT p.department AS department, " +
            "FUNCTION('date', p.createdAt) AS logDate, " +
            "COUNT(p.id) AS totalLogs, " +
            "MAX(p.prompt.riskScore) AS maxRisk " +
            "FROM PromptLog p " +
            "GROUP BY p.department, FUNCTION('date', p.createdAt)")
    List<Map<String, Object>> getHeatmapData();
}