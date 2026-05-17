package com.promptguard.api.dto;

public record PromptRequest(
        String employeeId,
        String department,
        String promptText
) {}
