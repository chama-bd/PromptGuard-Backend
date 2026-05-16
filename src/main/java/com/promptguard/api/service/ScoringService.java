package com.promptguard.api.service;

import com.promptguard.api.dto.SensitiveDataMatch;
import com.promptguard.api.model.SensitiveType;
import com.promptguard.api.model.Status;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoringService {

    /**
     * Calcule le score de risque basé sur les données sensibles détectées.
     * Algorithme :
     *   - Clé API (AWS, OpenAI, Stripe) = +40 pts
     *   - Credential DB = +35 pts
     *   - Email client = +20 pts
     *   - Données financières (CB) = +25 pts
     *   - Code propriétaire = +15 pts
     *   - JWT Token = +30 pts
     *   - Slack Token = +25 pts
     *   - IP Privée = +15 pts
     *   - Env Secret = +35 pts
     * Cap à 100.
     */
    public int calculateScore(List<SensitiveDataMatch> matches) {
        if (matches == null || matches.isEmpty()) {
            return 0;
        }

        int score = 0;
        for (SensitiveDataMatch match : matches) {
            score += getPointsForType(match.type());
        }

        return Math.min(score, 100);
    }

    /**
     * Détermine l'action à prendre en fonction du score :
     *   - score > 85 : BLOCKED
     *   - score 50-85 : ANONYMIZED
     *   - score < 50 : ALLOWED
     */
    public Status determineAction(int score) {
        if (score > 85) {
            return Status.BLOCKED;
        } else if (score >= 50) {
            return Status.ANONYMIZED;
        } else {
            return Status.ALLOWED;
        }
    }

    private int getPointsForType(SensitiveType type) {
        return switch (type) {
            case AWS_KEY, OPENAI_KEY, STRIPE_KEY -> 40;
            case DB_CREDENTIAL -> 35;
            case EMAIL -> 20;
            case CREDIT_CARD -> 25;
            case PROPRIETARY_CODE -> 15;
            case JWT_TOKEN -> 30;
            case SLACK_TOKEN -> 25;
            case PRIVATE_IP -> 15;
            case ENV_SECRET -> 35;
        };
    }
}
