package com.promptguard.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record PromptDto(
        UUID id,
        UUID employeeId,
        String content,
        Integer riskScore,
        String dataTypes,
        LocalDateTime timestamp
) {}
