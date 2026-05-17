package com.promptguard.api.dto;

import java.util.List;

public record PromptStatsDto(
        long totalPrompts,
        double averageRiskScore,
        List<String> topDataTypes
) {}
