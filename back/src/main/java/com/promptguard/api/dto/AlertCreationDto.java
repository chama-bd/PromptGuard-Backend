package com.promptguard.api.dto;

import java.util.UUID;

public record AlertCreationDto(
        String type,
        String severity,
        UUID employeeId,
        String message
) {}
