package com.promptguard.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "prompt_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromptLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String department;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String originalPrompt;

    @Column(columnDefinition = "TEXT")
    private String sanitizedPrompt;

    @Column(nullable = false)
    private Integer riskScore;

    @Column(columnDefinition = "TEXT")
    private String riskExplanation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private String leakType;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
