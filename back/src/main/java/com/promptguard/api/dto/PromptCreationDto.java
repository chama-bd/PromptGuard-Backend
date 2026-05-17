package com.promptguard.api.dto;

import java.util.UUID;

public record PromptCreationDto(
        UUID employeeId,
        String content,
        Integer riskScore,
        String dataTypes
) {}
