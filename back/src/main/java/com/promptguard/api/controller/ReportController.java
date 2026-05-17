package com.promptguard.api.controller;

import com.promptguard.api.dto.SecurityAnalyticsDto;
import com.promptguard.api.service.OllamaService;
import com.promptguard.api.service.SecurityIncidentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ReportController {

    private final SecurityIncidentService securityIncidentService;
    private final OllamaService ollamaService;

    @GetMapping("/generate")
    public ResponseEntity<Map<String, String>> generateReport() {
        try {
            log.info("Génération du rapport de sécurité via Ollama...");
            SecurityAnalyticsDto analytics = securityIncidentService.getAnalytics();
            
            String prompt = String.format(
                "Agis comme un RSSI (Responsable de la Sécurité des Systèmes d'Information). " +
                "Rédige un rapport de sécurité synthétique axé sur la conformité RGPD basé sur les statistiques suivantes : " +
                "Total des incidents: %d, Incidents bloqués: %d, Incidents anonymisés: %d, " +
                "Menace la plus fréquente: %s, Département le plus à risque: %s. " +
                "Fais une analyse rapide des risques et propose 2 recommandations majeures. " +
                "Format : Markdown structuré avec des titres, très clair et professionnel.",
                analytics.getTotalIncidents(),
                analytics.getBlockedIncidents(),
                analytics.getAnonymizedIncidents(),
                analytics.getMostCommonThreat(),
                analytics.getTopRiskyDepartment()
            );

            String report = ollamaService.generateResponse(prompt);
            return ResponseEntity.ok(Map.of("report", report));
        } catch (Exception e) {
            log.error("Erreur lors de la génération du rapport: {}", e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur lors de la génération du rapport"));
        }
    }
}
