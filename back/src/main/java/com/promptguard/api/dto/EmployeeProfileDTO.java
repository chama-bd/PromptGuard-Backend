package com.promptguard.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record EmployeeProfileDTO(
        UUID id,
        String name,
        String email,
        String role,
        String department,
        int securityScore,
        LocalDateTime createdAt,
        String avatarUrl
) {}