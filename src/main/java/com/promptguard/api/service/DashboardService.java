package com.promptguard.api.service;

import com.promptguard.api.dto.DashboardStats;
import com.promptguard.api.model.PromptLog;
import com.promptguard.api.model.Status;
import com.promptguard.api.repository.PromptLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PromptLogRepository promptLogRepository;

    public List<PromptLog> getAllLogs() {
        return promptLogRepository.findAllByOrderByCreatedAtDesc();
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
}
