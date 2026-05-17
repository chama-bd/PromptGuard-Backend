package com.promptguard.api.dto;

import java.util.Map;

public record DashboardStats(
        long totalPrompts,
        long blockedPrompts,
        long anonymizedPrompts,
        double averageRiskScore,
        Map<String, Long> incidentsByDepartment
) {}
