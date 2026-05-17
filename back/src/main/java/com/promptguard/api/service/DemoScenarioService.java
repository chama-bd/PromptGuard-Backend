package com.promptguard.api.service;

import com.promptguard.api.dto.PromptCreationDto;
import com.promptguard.api.model.Employee;
import com.promptguard.api.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DemoScenarioService {

    private final PromptService promptService;
    private final EmployeeRepository employeeRepository;

    /**
     * Déclenche un scénario de démo prédéfini pour tester le pipeline complet.
     * Scénarios :
     *   - "dev" : Un développeur colle du code avec une clé AWS
     *   - "hr" : Un RH partage des salaires avec des emails
     *   - "legal" : Un juriste colle un contrat avec des données sensibles
     */
    public void triggerScenario(String scenario) {
        switch (scenario.toLowerCase()) {
            case "dev" -> triggerDevScenario();
            case "hr" -> triggerHrScenario();
            case "legal" -> triggerLegalScenario();
            default -> throw new IllegalArgumentException("Scénario inconnu : " + scenario + ". Utilisez 'dev', 'hr' ou 'legal'.");
        }
    }

    private void triggerDevScenario() {
        String content = """
                Voici mon code de déploiement AWS :
                aws_access_key_id = AKIAIOSFODNN7EXAMPLE
                aws_secret = sk-proj1234567890abcdefghijklmnopqrstuvwxyz1234567890ab
                Connecte-toi au serveur 192.168.1.100 et déploie le service.
                La base de données est à jdbc:postgresql://prod-server:5432/clients_db
                """;

        promptService.createPrompt(new PromptCreationDto(
                getFirstEmployeeId(), content, 0, ""
        ));
    }

    private void triggerHrScenario() {
        String content = """
                Bonjour, voici la liste des salaires pour le rapport mensuel :
                - Jean Dupont (jean.dupont@entreprise.fr) : 45 000€
                - Marie Martin (marie.martin@entreprise.fr) : 52 000€
                Numéro CB pour le bonus : 4532015112830366
                Peux-tu formater ces données en tableau Excel ?
                """;

        promptService.createPrompt(new PromptCreationDto(
                getFirstEmployeeId(), content, 0, ""
        ));
    }

    private void triggerLegalScenario() {
        String content = """
                Analyse ce contrat confidentiel :
                CLIENT : Acme Corp, contact@acme-corp.com
                TOKEN D'API Slack du client : xoxb-123456789-abcdefghij
                Clé Stripe de paiement : sk_live_51HGbcJKLMNOPQRSTUVWXYZ
                Le serveur interne est à 172.16.0.55
                PASSWORD=SuperSecret123!
                """;

        promptService.createPrompt(new PromptCreationDto(
                getFirstEmployeeId(), content, 0, ""
        ));
    }

    /**
     * Retourne le premier employé de la BDD pour la démo.
     */
    private UUID getFirstEmployeeId() {
        return employeeRepository.findAll().stream()
                .findFirst()
                .map(Employee::getId)
                .orElseThrow(() -> new IllegalStateException("Aucun employé trouvé en BDD pour la démo"));
    }
}
