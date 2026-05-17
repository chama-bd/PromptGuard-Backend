package com.promptguard.api.dto;

import com.promptguard.api.model.Status;

public record PromptResponse(
        Status status,
        Integer riskScore,
        String riskExplanation,
        String sanitizedPrompt,
        String localAIResponse
) {}
