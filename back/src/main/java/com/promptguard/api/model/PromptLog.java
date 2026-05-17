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

    // LA RELATION UNIQUE : Lie ce Log au Prompt d'origine
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id", nullable = false, unique = true)
    private Prompt prompt;

    @Column(nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String department;

    @Column(columnDefinition = "TEXT")
    private String sanitizedPrompt;

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