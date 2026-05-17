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
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@Slf4j
@RequiredArgsConstructor
public class OllamaService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final AiChatService aiChatService;

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

    /**
     * Génère une réponse via l'API locale Ollama en temps réel (SSE streaming).
     * @param prompt La requête textuelle à envoyer au modèle.
     * @param sessionId L'identifiant optionnel de la session de chat.
     * @param emitter Le SseEmitter pour envoyer les chunks au client.
     */
    public void streamResponse(String prompt, Long sessionId, SseEmitter emitter) {
        new Thread(() -> {
            try {
                ObjectMapper mapper = new ObjectMapper();
                String body = mapper.writeValueAsString(Map.of(
                    "model", model,
                    "prompt", prompt,
                    "stream", true
                ));

                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(ollamaUrl + "/api/generate"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

                StringBuilder accumulatedResponse = new StringBuilder();
                java.util.concurrent.atomic.AtomicBoolean isDisconnected = new java.util.concurrent.atomic.AtomicBoolean(false);

                client.sendAsync(request, HttpResponse.BodyHandlers.ofLines())
                    .thenAccept(response -> {
                        response.body().forEach(line -> {
                            if (isDisconnected.get()) {
                                return;
                            }
                            try {
                                if (line != null && !line.isBlank()) {
                                    Map<String, Object> json = mapper.readValue(line, Map.class);
                                    if (json.containsKey("response")) {
                                        String token = (String) json.get("response");
                                        accumulatedResponse.append(token);
                                        try {
                                            emitter.send(SseEmitter.event().data(token));
                                        } catch (Exception e) {
                                            log.warn("Client déconnecté (Génération stoppée). Arrêt immédiat du flux Ollama.");
                                            isDisconnected.set(true);
                                            try {
                                                response.body().close();
                                            } catch (Exception closeEx) {
                                                // Ignore
                                            }
                                            return;
                                        }
                                    }
                                    if (Boolean.TRUE.equals(json.get("done"))) {
                                        if (sessionId != null) {
                                            try {
                                                aiChatService.saveMessages(sessionId, prompt, accumulatedResponse.toString());
                                            } catch (Exception e) {
                                                log.error("Erreur lors de l'enregistrement en BDD pour la session {}: {}", sessionId, e.getMessage());
                                            }
                                        }
                                        emitter.complete();
                                    }
                                }
                            } catch (Exception e) {
                                if (!isDisconnected.get()) {
                                    log.error("Erreur parsing ligne Ollama: {}", e.getMessage());
                                }
                            }
                        });
                    }).exceptionally(ex -> {
                        if (!isDisconnected.get()) {
                            emitter.completeWithError(ex);
                        }
                        return null;
                    });
            } catch (Exception e) {
                log.error("Erreur init stream Ollama: {}", e.getMessage());
                emitter.completeWithError(e);
            }
        }).start();
    }
}
