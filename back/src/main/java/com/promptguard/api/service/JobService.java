package com.promptguard.api.service;

import com.promptguard.api.dto.SecurityAnalyticsDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final SecurityIncidentService securityIncidentService;
    private final OllamaService ollamaService;

    /**
     * Exécuté tous les jours à 18h00 (format cron: sec min heure jour mois jourSemaine)
     * Génère un rapport de fin de journée via Ollama.
     */
    @Scheduled(cron = "0 0 18 * * ?")
    public void generateDailyReport() {
        log.info("Démarrage du job de fin de journée : Génération du rapport de sécurité via Ollama...");
        try {
            SecurityAnalyticsDto analytics = securityIncidentService.getAnalytics();
            
            String prompt = String.format(
                "Génère un court bilan de fin de journée pour l'équipe de sécurité. " +
                "Nous avons eu %d incidents au total (dont %d bloqués et %d anonymisés). " +
                "La menace principale était %s et le département le plus risqué : %s. " +
                "Fais un résumé professionnel de 3 phrases et ajoute un mot d'encouragement à l'équipe.",
                analytics.getTotalIncidents(),
                analytics.getBlockedIncidents(),
                analytics.getAnonymizedIncidents(),
                analytics.getMostCommonThreat(),
                analytics.getTopRiskyDepartment()
            );

            String report = ollamaService.generateResponse(prompt);
            
            log.info("\n=== RAPPORT DE FIN DE JOURNÉE ===\n{}\n=================================", report);
            
            // NOTE: Ici, on pourrait étendre pour envoyer le rapport par email, sur un channel Slack/Teams, etc.
            
        } catch (Exception e) {
            log.error("Erreur lors de la génération du rapport quotidien : {}", e.getMessage());
        }
    }
}
