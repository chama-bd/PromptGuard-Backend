package com.promptguard.api.service;

import com.promptguard.api.dto.SensitiveDataMatch;
import com.promptguard.api.model.SensitiveType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class DetectionService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final Map<SensitiveType, Pattern> PATTERNS = new LinkedHashMap<>();

    static {
        // Clés AWS
        PATTERNS.put(SensitiveType.AWS_KEY, Pattern.compile("AKIA[0-9A-Z]{16}"));
        // Clés OpenAI
        PATTERNS.put(SensitiveType.OPENAI_KEY, Pattern.compile("sk-[a-zA-Z0-9]{20,}"));
        // Tokens JWT
        PATTERNS.put(SensitiveType.JWT_TOKEN, Pattern.compile("eyJ[a-zA-Z0-9._-]+"));
        // Emails
        PATTERNS.put(SensitiveType.EMAIL, Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"));
        // IP Privées
        PATTERNS.put(SensitiveType.PRIVATE_IP, Pattern.compile("(?:10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|172\\.(?:1[6-9]|2\\d|3[01])\\.\\d{1,3}\\.\\d{1,3}|192\\.168\\.\\d{1,3}\\.\\d{1,3})"));
        // Numéros de carte de crédit (Visa, Mastercard, Amex)
        PATTERNS.put(SensitiveType.CREDIT_CARD, Pattern.compile("\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\\b"));
        // Connexions DB (jdbc)
        PATTERNS.put(SensitiveType.DB_CREDENTIAL, Pattern.compile("jdbc:[a-zA-Z0-9]+://[^\\s]+"));
        // Clés Stripe
        PATTERNS.put(SensitiveType.STRIPE_KEY, Pattern.compile("sk_live_[a-zA-Z0-9]{20,}"));
        // Tokens Slack
        PATTERNS.put(SensitiveType.SLACK_TOKEN, Pattern.compile("xoxb-[a-zA-Z0-9-]+"));
        // Variables d'env sensibles (.env patterns)
        PATTERNS.put(SensitiveType.ENV_SECRET, Pattern.compile("(?:API_KEY|SECRET_KEY|PASSWORD|DB_PASSWORD|AUTH_TOKEN)\\s*=\\s*[^\\s]+"));
    }

    /**
     * Détecte toutes les données sensibles dans le texte donné via regex.
     */
    public List<SensitiveDataMatch> detect(String text) {
        List<SensitiveDataMatch> matches = new ArrayList<>();
        if (text == null || text.isBlank()) {
            return matches;
        }

        for (Map.Entry<SensitiveType, Pattern> entry : PATTERNS.entrySet()) {
            SensitiveType type = entry.getKey();
            Pattern pattern = entry.getValue();
            Matcher matcher = pattern.matcher(text);

            while (matcher.find()) {
                int riskLevel = getRiskLevel(type);
                matches.add(new SensitiveDataMatch(
                        type,
                        matcher.group(),
                        matcher.start(),
                        matcher.end(),
                        riskLevel
                ));
            }
        }

        return matches;
    }

    /**
     * Appelle l'API Groq pour détecter les données sensibles via LLM.
     */
    public String callGroqApi(String text, String apiKey) {
        String url = "https://api.groq.com/openai/v1/chat/completions";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        
        String systemPrompt = "Analyse ce texte et détecte : clés API, emails, mots de passe, données RGPD. Réponds UNIQUEMENT en JSON au format : {\"detected\": [{\"type\": \"string\", \"value\": \"string\", \"risk\": 1}]}";
        
        Map<String, Object> requestBody = Map.of(
            "model", "llama3-8b-8192",
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", text)
            ),
            "temperature", 0.0,
            "response_format", Map.of("type", "json_object")
        );
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            log.info("Appel à Groq API pour analyse de texte...");
            Map<String, Object> response = restTemplate.postForObject(url, entity, Map.class);
            
            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    if (message != null && message.containsKey("content")) {
                        return (String) message.get("content");
                    }
                }
            }
            return "{}";
        } catch (Exception e) {
            log.error("Erreur lors de l'appel à l'API Groq: {}", e.getMessage());
            return "{}";
        }
    }

    private int getRiskLevel(SensitiveType type) {
        return switch (type) {
            case AWS_KEY, OPENAI_KEY, STRIPE_KEY -> 5;
            case JWT_TOKEN, SLACK_TOKEN -> 4;
            case DB_CREDENTIAL, ENV_SECRET -> 4;
            case CREDIT_CARD -> 5;
            case PRIVATE_IP -> 3;
            case EMAIL -> 2;
            case PROPRIETARY_CODE -> 3;
        };
    }
}
