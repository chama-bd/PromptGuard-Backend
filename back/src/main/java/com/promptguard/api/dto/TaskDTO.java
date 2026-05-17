package com.promptguard.api.dto;

import java.time.LocalDateTime;

public record TaskDTO(
        Long id,
        String title,
        String description,
        LocalDateTime deadline,
        String priority,
        String status )
 {}