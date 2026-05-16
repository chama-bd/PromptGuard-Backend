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
@Table(name = "security_incidents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SecurityIncident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String threatType;

    @Column(nullable = false)
    private Integer riskScore;

    @Column(nullable = false)
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String actionTaken; // BLOCKED, ANONYMIZED, ALLOWED

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String endpoint;

    @Column(columnDefinition = "TEXT")
    private String aiExplanation;

    @Column(columnDefinition = "TEXT")
    private String aiRecommendations;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;
}
