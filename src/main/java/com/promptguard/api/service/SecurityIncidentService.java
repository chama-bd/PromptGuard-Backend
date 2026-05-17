package com.promptguard.api.service;

import com.promptguard.api.dto.SecurityAnalyticsDto;
import com.promptguard.api.dto.SecurityIncidentDto;
import com.promptguard.api.dto.SensitiveDataMatch;
import com.promptguard.api.model.*;
import com.promptguard.api.repository.SecurityIncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SecurityIncidentService {

    private final SecurityIncidentRepository securityIncidentRepository;
    private final EventService eventService;
    private final OllamaService ollamaService;
    private final NotificationService notificationService;

    /**
     * Loguer un incident de sécurité en BDD, déclencher la réponse automatique et broadcaster via SSE.
     */
    @Transactional
    public void logIncident(String username, String endpoint, List<SensitiveDataMatch> matches, int score, Status status) {
        String threatTypes = matches.stream()
                .map(m -> m.type().name())
                .distinct()
                .collect(Collectors.joining(", "));

        IncidentSeverity severity = determineSeverity(score);
        IncidentAction action = determineBestAction(threatTypes, score);

        String promptExplanation = String.format("Explique brièvement le risque de sécurité concernant la fuite des données de type: %s. Sois concis (1-2 phrases).", threatTypes);
        String aiExplanation = ollamaService.generateResponse(promptExplanation);

        String promptRecommendations = String.format("Donne une ou deux recommandations courtes pour sécuriser et éviter d'exposer ce type de données: %s. Sois très bref.", threatTypes);
        String aiRecommendations = ollamaService.generateResponse(promptRecommendations);

        SecurityIncident incident = SecurityIncident.builder()
                .threatType(threatTypes)
                .riskScore(score)
                .severity(severity)
                .actionTaken(action)
                .username(username)
                .endpoint(endpoint)
                .aiExplanation(aiExplanation)
                .aiRecommendations(aiRecommendations)
                .forensicData("TraceID: " + UUID.randomUUID())
                .build();

        SecurityIncident saved = securityIncidentRepository.saveAndFlush(incident);

        // Déclencher les actions de remédiation si nécessaire
        if (severity == IncidentSeverity.CRITICAL || severity == IncidentSeverity.HIGH) {
            executeRemediation(action, username, threatTypes);
            notifyIncident(saved, threatTypes);
        }

        // Broadcaster l'incident en temps réel via SSE
        eventService.broadcast(saved);
    }

    private void executeRemediation(IncidentAction action, String username, String threatTypes) {
        log.warn("AUTOMATED RESPONSE: Executing {} for user {}", action, username);
        switch (action) {
            case REVOKE_GITHUB_TOKEN:
                log.info("[MOCK] GitHub API: Revoking developer token for {}", username);
                break;
            case DISABLE_AWS_ACCESS:
                log.info("[MOCK] AWS IAM: Disabling IAM Access Keys for {}", username);
                break;
            case ACCOUNT_LOCK:
                log.info("[MOCK] Auth Service: Locking user account {}", username);
                break;
            default:
                log.info("No automated remediation action required for {}", action);
        }
    }

    private void notifyIncident(SecurityIncident incident, String threatTypes) {
        String details = String.format("User: %s\nThreat: %s\nSeverity: %s\nAction: %s", 
                incident.getUsername(), threatTypes, incident.getSeverity(), incident.getActionTaken());
        
        notificationService.sendCriticalEmail("rssi@promptguard.enterprise", details);
        notificationService.sendSlackAlert("#security-critical", "🚨 " + incident.getSeverity() + " incident for " + incident.getUsername());
        
        if (incident.getSeverity() == IncidentSeverity.CRITICAL) {
            notificationService.sendSms("+212600000000", "CRITICAL SECURITY BREACH: " + incident.getUsername());
        }
    }

    private IncidentAction determineBestAction(String threatTypes, int score) {
        if (score >= 90) {
            if (threatTypes.contains("GITHUB") || threatTypes.contains("TOKEN")) return IncidentAction.REVOKE_GITHUB_TOKEN;
            if (threatTypes.contains("AWS") || threatTypes.contains("CLOUD")) return IncidentAction.DISABLE_AWS_ACCESS;
            return IncidentAction.ACCOUNT_LOCK;
        }
        if (score >= 70) return IncidentAction.SLACK_ALERT;
        return IncidentAction.FORENSIC_LOG;
    }

    private String generateRecommendations(IncidentSeverity severity) {
        switch (severity) {
            case CRITICAL: return "Immediate token revocation and account audit. Contact SOC Tier 3.";
            case HIGH: return "Investigate source of leak. Enforce mandatory security training.";
            case MEDIUM: return "Monitor user activity closely. Review data handling policies.";
            default: return "Inform user about secure data practices.";
        }
    }

    @Transactional(readOnly = true)
    public List<SecurityIncident> getRecentIncidents() {
        return securityIncidentRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    @Transactional(readOnly = true)
    public List<SecurityIncidentDto> getRecentIncidentDtos() {
        return getRecentIncidents().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private SecurityIncidentDto mapToDto(SecurityIncident incident) {
        return SecurityIncidentDto.builder()
                .id(incident.getId())
                .threatType(incident.getThreatType())
                .riskScore(incident.getRiskScore())
                .severity(incident.getSeverity().name())
                .actionTaken(incident.getActionTaken().name())
                .username(incident.getUsername())
                .endpoint(incident.getEndpoint())
                .aiExplanation(incident.getAiExplanation())
                .aiRecommendations(incident.getAiRecommendations())
                .timestamp(incident.getTimestamp())
                .build();
    }

    @Transactional(readOnly = true)
    public SecurityAnalyticsDto getAnalytics() {
        List<SecurityIncident> allIncidents = securityIncidentRepository.findAll();

        long total = allIncidents.size();
        long critical = allIncidents.stream().filter(i -> i.getSeverity() == IncidentSeverity.CRITICAL).count();
        
        String mostCommon = allIncidents.stream()
                .map(SecurityIncident::getThreatType)
                .collect(Collectors.groupingBy(t -> t, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        Map<String, Long> bySeverity = allIncidents.stream()
                .collect(Collectors.groupingBy(i -> i.getSeverity().name(), Collectors.counting()));

        return SecurityAnalyticsDto.builder()
                .totalIncidents(total)
                .blockedIncidents(critical)
                .anonymizedIncidents(0) // Non géré explicitement ici
                .mostCommonThreat(mostCommon)
                .topRiskyDepartment("N/A")
                .incidentsBySeverity(bySeverity)
                .build();
    }

    private IncidentSeverity determineSeverity(int score) {
        if (score >= 90) return IncidentSeverity.CRITICAL;
        if (score >= 75) return IncidentSeverity.HIGH;
        if (score >= 50) return IncidentSeverity.MEDIUM;
        return IncidentSeverity.LOW;
    }
}
