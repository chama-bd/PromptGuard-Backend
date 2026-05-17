package com.promptguard.api.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class SecurityAnalyticsDto {
    private long totalIncidents;
    private long blockedIncidents;
    private long anonymizedIncidents;
    private String mostCommonThreat;
    private String topRiskyDepartment;
    private Map<String, Long> incidentsBySeverity;
}
