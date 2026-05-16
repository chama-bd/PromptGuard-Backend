package com.promptguard.api.dto;

import com.promptguard.api.model.SensitiveType;

public record SensitiveDataMatch(
    SensitiveType type,
    String value,
    int startPosition,
    int endPosition,
    int riskLevel
) {}
