package com.promptguard.api.dto;

import com.promptguard.api.model.Status;
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
public class PromptLogDto {
    private UUID id;
    private UUID promptId;
    private String employeeId;
    private String department;
    private String sanitizedPrompt;
    private String riskExplanation;
    private Status status;
    private String leakType;
    private LocalDateTime createdAt;
}
