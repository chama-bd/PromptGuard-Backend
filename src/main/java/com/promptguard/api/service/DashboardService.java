package com.promptguard.api.service;

import com.promptguard.api.dto.DashboardStats;
import com.promptguard.api.dto.DepartmentIncidentDTO; // <-- Pense à importer ton nouveau Record si tu l'as créé
import com.promptguard.api.dto.EmployeeRiskProfileDTO;
import com.promptguard.api.dto.PromptLogDto;
import com.promptguard.api.model.PromptLog;
import com.promptguard.api.model.Status;
import com.promptguard.api.repository.PromptLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PromptLogRepository promptLogRepository;

    public List<PromptLogDto> getAllLogs() {
        return promptLogRepository.findAllWithPromptOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private PromptLogDto mapToDto(PromptLog log) {
        return PromptLogDto.builder()
                .id(log.getId())
                .promptId(log.getPrompt() != null ? log.getPrompt().getId() : null)
                .employeeId(log.getEmployeeId())
                .department(log.getDepartment())
                .sanitizedPrompt(log.getSanitizedPrompt())
                .riskExplanation(log.getRiskExplanation())
                .status(log.getStatus())
                .leakType(log.getLeakType())
                .createdAt(log.getCreatedAt())
                .build();
    }

    public DashboardStats getStats() {
        long total = promptLogRepository.count();
        long blocked = promptLogRepository.countByStatus(Status.BLOCKED);
        long anonymized = promptLogRepository.countByStatus(Status.ANONYMIZED);

        Double avgRiskRaw = promptLogRepository.getAverageRiskScore();
        double avgRisk = avgRiskRaw != null ? avgRiskRaw : 0.0;

        List<Object[]> incidentsData = promptLogRepository.getRiskIncidentsByDepartment();
        Map<String, Long> incidentsByDept = new HashMap<>();
        for (Object[] row : incidentsData) {
            String dept = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            incidentsByDept.put(dept, count);
        }

        return new DashboardStats(total, blocked, anonymized, avgRisk, incidentsByDept);
    }

    /**
     * NOUVELLE MODIFICATION AJOUTÉE POUR TON NOUVEL ENDPOINT
     * Transforme les données brutes Object[] du repository en une liste propre de DTOs (Records)
     */
    public List<DepartmentIncidentDTO> getIncidentsStatsByDepartment() {
        List<Object[]> rawData = promptLogRepository.getRiskIncidentsByDepartment();

        return rawData.stream()
                .map(row -> new DepartmentIncidentDTO(
                        (String) row[0],                        // Nom du département
                        ((Number) row[1]).longValue()          // Nombre d'incidents (sécurisé avec Number)
                ))
                .collect(Collectors.toList());
    }
    public EmployeeRiskProfileDTO getEmployeeRiskProfile(String employeeId) {
        // 1. Récupérer tous les logs de cet employé
        List<PromptLog> employeeLogs = promptLogRepository.findAll().stream()
                .filter(log -> log.getEmployeeId().equals(employeeId))
                .collect(Collectors.toList());

        if (employeeLogs.isEmpty()) {
            return new EmployeeRiskProfileDTO(null, "Inconnu", 0, 0, 0.0);
        }

        // 2. Extraire les infos d'agrégation
        String department = employeeLogs.get(0).getDepartment();
        long totalPrompts = employeeLogs.size();
        long blockedPrompts = employeeLogs.stream()
                .filter(log -> log.getStatus() == Status.BLOCKED)
                .count();

        double avgRisk = employeeLogs.stream()
                .mapToDouble(log -> log.getPrompt() != null ? log.getPrompt().getRiskScore() : 0.0)
                .average()
                .orElse(0.0);

        return new EmployeeRiskProfileDTO(
                UUID.fromString(employeeId), // Ajuste si ton type en base est différent
                department,
                totalPrompts,
                blockedPrompts,
                Math.round(avgRisk * 100.0) / 100.0 // Arrondi à 2 décimales
        );
    }
}