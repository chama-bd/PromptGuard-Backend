package com.promptguard.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.promptguard.api.dto.PromptCreationDto;
import com.promptguard.api.dto.SensitiveDataMatch;
import com.promptguard.api.model.Status;
import com.promptguard.api.service.AnonymizationService;
import com.promptguard.api.service.DetectionService;
import com.promptguard.api.service.ScoringService;
import com.promptguard.api.service.SecurityIncidentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DetectionInterceptor implements HandlerInterceptor {

    private final DetectionService detectionService;
    private final ScoringService scoringService;
    private final AnonymizationService anonymizationService;
    private final SecurityIncidentService incidentService;
    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (request instanceof CachedBodyHttpServletRequestWrapper wrappedRequest) {
            byte[] body = wrappedRequest.getCachedBody();
            try {
                PromptCreationDto dto = objectMapper.readValue(body, PromptCreationDto.class);

                if (dto.content() != null) {
                    List<SensitiveDataMatch> matches = detectionService.detect(dto.content());
                    
                    if (!matches.isEmpty()) {
                        int score = scoringService.calculateScore(matches);
                        Status action = scoringService.determineAction(score);
                        
                        // Log Incident and Broadcast Event
                        String username = SecurityContextHolder.getContext().getAuthentication() != null ? 
                                SecurityContextHolder.getContext().getAuthentication().getName() : "anonymous";
                        
                        incidentService.logIncident(username, wrappedRequest.getServletPath(), matches, score, action);

                        if (action == Status.BLOCKED) {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Request blocked due to high risk sensitive data detected.\", \"riskScore\": " + score + "}");
                            return false;
                        }

                        String finalContent = dto.content();
                        if (action == Status.ANONYMIZED) {
                            finalContent = anonymizationService.anonymize(dto.content(), matches);
                        }

                        String dataTypes = matches.stream()
                                .map(m -> m.type().name())
                                .distinct()
                                .collect(Collectors.joining(","));

                        // Update DTO with analyzed data
                        PromptCreationDto updatedDto = new PromptCreationDto(
                                dto.employeeId(),
                                finalContent,
                                score,
                                dataTypes
                        );

                        wrappedRequest.setCachedBody(objectMapper.writeValueAsBytes(updatedDto));
                    }
                }
            } catch (Exception e) {
                // If parsing fails, just let it pass or handle as needed
                // For safety, we'll let it proceed to let the controller handle validation errors
            }
        }
        return true;
    }
}
