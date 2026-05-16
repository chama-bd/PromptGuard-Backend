package com.promptguard.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class OllamaService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ollama.url:http://localhost:11434}")
    private String ollamaUrl;

    @Value("${ollama.model:llama3}")
    private String model;

    /**
     * Génère une réponse via l'API locale Ollama.
     * @param prompt La requête textuelle à envoyer au modèle.
     * @return La réponse générée par l'IA.
     */
    public String generateResponse(String prompt) {
        String endpoint = ollamaUrl + "/api/generate";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> requestBody = Map.of(
            "model", model,
            "prompt", prompt,
            "stream", false
        );
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            log.info("Appel à Ollama: URL={}, Modèle={}, Prompt={}", endpoint, model, prompt);
            // On utilise Map.class pour récupérer la réponse JSON générique
            Map<String, Object> response = restTemplate.postForObject(endpoint, entity, Map.class);
            if (response != null && response.containsKey("response")) {
                return (String) response.get("response");
            }
            return "Réponse vide de l'IA.";
        } catch (Exception e) {
            log.error("Erreur lors de l'appel à Ollama: {}", e.getMessage());
            return "Erreur lors de la génération avec Ollama: " + e.getMessage();
        }
    }
}
