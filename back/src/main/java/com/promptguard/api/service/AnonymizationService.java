package com.promptguard.api.service;

import com.promptguard.api.dto.SensitiveDataMatch;
import com.promptguard.api.model.SensitiveType;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnonymizationService {

    // Mapping en mémoire pour la session : original -> fake
    private final Map<String, String> sessionMappings = new LinkedHashMap<>();

    /**
     * Anonymise le contenu en remplaçant chaque donnée sensible par un équivalent fake
     * syntaxiquement valide. Garde un mapping session en mémoire.
     */
    public String anonymize(String content, List<SensitiveDataMatch> matches) {
        if (matches == null || matches.isEmpty()) {
            return content;
        }

        // Trier les matches par position décroissante pour remplacer de la fin vers le début
        List<SensitiveDataMatch> sorted = new ArrayList<>(matches);
        sorted.sort(Comparator.comparingInt(SensitiveDataMatch::startPosition).reversed());

        String result = content;
        for (SensitiveDataMatch match : sorted) {
            String fakeValue = generateFake(match.type(), match.value());
            sessionMappings.put(match.value(), fakeValue);
            result = result.substring(0, match.startPosition()) + fakeValue + result.substring(match.endPosition());
        }

        return result;
    }

    /**
     * Retourne le mapping session actuel (original -> fake).
     */
    public Map<String, String> getSessionMappings() {
        return Collections.unmodifiableMap(sessionMappings);
    }

    /**
     * Génère un équivalent fake syntaxiquement valide pour chaque type de donnée sensible.
     */
    private String generateFake(SensitiveType type, String original) {
        return switch (type) {
            case AWS_KEY -> "AKIAFAKEKEY1234567890";
            case OPENAI_KEY -> "sk-fakeopenaikey0000000000000000000000000000000000000";
            case JWT_TOKEN -> "eyJfakeToken.fakePayload.fakeSignature";
            case EMAIL -> "user_demo@company-demo.com";
            case PRIVATE_IP -> "10.0.0.1";
            case CREDIT_CARD -> "4111111111111111";
            case DB_CREDENTIAL -> "jdbc:postgresql://localhost:5432/fake_db";
            case STRIPE_KEY -> "sk_live_fakestripekeyxxxxxxxxx";
            case SLACK_TOKEN -> "xoxb-fake-slack-token-000000";
            case ENV_SECRET -> "SECRET_KEY=FAKE_SECRET_VALUE_000";
            case PROPRIETARY_CODE -> "[PROPRIETARY_CODE_REDACTED]";
        };
    }
}
