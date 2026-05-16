package com.promptguard.api.service;

import com.promptguard.api.dto.SecurityAnalyticsDto;
import com.promptguard.api.dto.SecurityIncidentDto;
import com.promptguard.api.dto.SensitiveDataMatch;
import com.promptguard.api.model.SecurityIncident;
import com.promptguard.api.model.Status;
import com.promptguard.api.repository.SecurityIncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SecurityIncidentService {

    private final SecurityIncidentRepository securityIncidentRepository;
    private final EventService eventService;

    /**
     * Loguer un incident de sécurité en BDD et broadcaster via SSE.
     */
    @Transactional
    public void logIncident(String username, String endpoint, List<SensitiveDataMatch> matches, int score, Status action) {
        String threatTypes = matches.stream()
                .map(m -> m.type().name())
                .distinct()
                .collect(Collectors.joining(", "));

        String severity = determineSeverity(score);

        SecurityIncident incident = SecurityIncident.builder()
                .threatType(threatTypes)
                .riskScore(score)
                .severity(severity)
                .actionTaken(action.name())
                .username(username)
                .endpoint(endpoint)
                .aiExplanation("Données sensibles détectées: " + threatTypes + ". Score de risque: " + score + "/100.")
                .aiRecommendations("Éviter de coller des données sensibles dans les prompts. Utiliser des variables d'environnement sécurisées.")
                .build();

        SecurityIncident saved = securityIncidentRepository.saveAndFlush(incident);

        // Broadcaster l'incident en temps réel via SSE
        eventService.broadcast(saved);
    }

    /**
     * Récupérer les incidents récents triés par date décroissante.
     */
    @Transactional(readOnly = true)
    public List<SecurityIncident> getRecentIncidents() {
        return securityIncidentRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    /**
     * Récupérer les incidents récents mappés en DTO.
     */
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
                .severity(incident.getSeverity())
                .actionTaken(incident.getActionTaken())
                .username(incident.getUsername())
                .endpoint(incident.getEndpoint())
                .aiExplanation(incident.getAiExplanation())
                .aiRecommendations(incident.getAiRecommendations())
                .timestamp(incident.getTimestamp())
                .build();
    }

    /**
     * Calculer les analytics de sécurité.
     */
    @Transactional(readOnly = true)
    public SecurityAnalyticsDto getAnalytics() {
        List<SecurityIncident> allIncidents = securityIncidentRepository.findAll();

        long total = allIncidents.size();
        long blocked = allIncidents.stream().filter(i -> "BLOCKED".equals(i.getActionTaken())).count();
        long anonymized = allIncidents.stream().filter(i -> "ANONYMIZED".equals(i.getActionTaken())).count();

        // Menace la plus fréquente
        String mostCommon = allIncidents.stream()
                .map(SecurityIncident::getThreatType)
                .collect(Collectors.groupingBy(t -> t, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        // Département le plus à risque (via username/endpoint - simplifié)
        String topDepartment = allIncidents.stream()
                .map(SecurityIncident::getUsername)
                .collect(Collectors.groupingBy(u -> u, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        Map<String, Long> bySeverity = allIncidents.stream()
                .collect(Collectors.groupingBy(SecurityIncident::getSeverity, Collectors.counting()));

        return SecurityAnalyticsDto.builder()
                .totalIncidents(total)
                .blockedIncidents(blocked)
                .anonymizedIncidents(anonymized)
                .mostCommonThreat(mostCommon)
                .topRiskyDepartment(topDepartment)
                .incidentsBySeverity(bySeverity)
                .build();
    }

    private String determineSeverity(int score) {
        if (score > 85) return "CRITICAL";
        if (score > 70) return "HIGH";
        if (score > 50) return "MEDIUM";
        return "LOW";
    }
}
