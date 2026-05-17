package com.promptguard.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecurityIncidentDto {
    private UUID id;
    private String threatType;
    private Integer riskScore;
    private String severity;
    private String actionTaken;
    private String username;
    private String endpoint;
    private String aiExplanation;
    private String aiRecommendations;
    private LocalDateTime timestamp;
}
