package com.promptguard.api.dto;

import java.util.UUID;

public record LoginResponse(
        String token,
        UUID employeeId,
        String name,
        String department
) {}
