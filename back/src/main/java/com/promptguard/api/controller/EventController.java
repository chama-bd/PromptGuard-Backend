package com.promptguard.api.controller;

import com.promptguard.api.dto.SensitiveDataMatch;
import com.promptguard.api.model.Status;
import com.promptguard.api.service.DetectionService;
import com.promptguard.api.service.EventService;
import com.promptguard.api.service.OllamaService;
import com.promptguard.api.service.ScoringService;
import com.promptguard.api.service.SecurityIncidentService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;
    private final OllamaService ollamaService;
    private final DetectionService detectionService;
    private final ScoringService scoringService;
    private final SecurityIncidentService incidentService;

    @GetMapping("/live")
    public SseEmitter liveIncidents() {
        return eventService.subscribe();
    }

    @PostMapping(value = "/chat/stream")
    public SseEmitter streamChat(
            @RequestBody Map<String, Object> request,
            HttpServletResponse httpResponse) throws IOException {
        String prompt = (String) request.getOrDefault("prompt", "");
        
        // Analyser le prompt à la recherche de données sensibles avant de le passer à Ollama
        List<SensitiveDataMatch> matches = detectionService.detect(prompt);
        if (!matches.isEmpty()) {
            String username = SecurityContextHolder.getContext().getAuthentication() != null ? 
                    SecurityContextHolder.getContext().getAuthentication().getName() : "anonymous";
            int score = scoringService.calculateScore(matches, username);
            Status action = scoringService.determineAction(score);
            
            // Logger l'incident de sécurité et le diffuser en temps réel sur le tableau de bord RSSI
            incidentService.logIncident(username, "/api/incidents/chat/stream", matches, score, action);
            
            if (action == Status.BLOCKED) {
                List<String> threatsList = matches.stream()
                        .map(m -> m.type().name())
                        .distinct()
                        .collect(Collectors.toList());
                
                httpResponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
                httpResponse.setContentType("application/json");
                httpResponse.setCharacterEncoding("UTF-8");
                
                String threatsJson = threatsList.stream()
                        .map(t -> "\"" + t + "\"")
                        .collect(Collectors.joining(","));
                
                String jsonBody = String.format("{\"score\":%d,\"threats\":[%s]}", score, threatsJson);
                
                httpResponse.getWriter().write(jsonBody);
                httpResponse.getWriter().flush();
                return null;
            }
        }

        Object sessionIdObj = request.get("sessionId");
        Long sessionId = null;
        if (sessionIdObj != null) {
            if (sessionIdObj instanceof Number) {
                sessionId = ((Number) sessionIdObj).longValue();
            } else {
                try {
                    sessionId = Long.parseLong(sessionIdObj.toString());
                } catch (NumberFormatException e) {
                    // Ignore
                }
            }
        }
        SseEmitter emitter = new SseEmitter(0L); // Timeout infini
        ollamaService.streamResponse(prompt, sessionId, emitter);
        return emitter;
    }
}
