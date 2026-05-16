package com.promptguard.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AlertDto(
        UUID id,
        String type,
        String severity,
        UUID employeeId,
        String message,
        boolean isGrouped,
        LocalDateTime createdAt
) {}
