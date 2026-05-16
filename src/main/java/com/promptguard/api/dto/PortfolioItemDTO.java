package com.promptguard.api.dto;

import java.time.LocalDateTime;

public record PortfolioItemDTO(
        Long id,
        String title,
        String type,
        String description,
        LocalDateTime completedAt
) {}