package com.promptguard.api.dto;

import com.promptguard.api.model.Status;
import java.util.List;

public record DetectionResponse(
    int riskScore,
    List<SensitiveDataMatch> matches,
    String anonymizedContent,
    Status action
) {}
