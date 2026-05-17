package com.promptguard.api.dto;

import java.util.UUID;

public record EmployeeRiskProfileDTO(
        UUID employeeId,
        String department,
        long totalPrompts,
        long blockedPrompts,
        double averageRiskScore
) {}