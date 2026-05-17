package com.promptguard.api.controller;

import com.promptguard.api.dto.DetectionRequest;
import com.promptguard.api.dto.DetectionResponse;
import com.promptguard.api.dto.SensitiveDataMatch;
import com.promptguard.api.model.Status;
import com.promptguard.api.service.AnonymizationService;
import com.promptguard.api.service.DetectionService;
import com.promptguard.api.service.ScoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detect")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DetectionController {

    private final DetectionService detectionService;
    private final ScoringService scoringService;
    private final AnonymizationService anonymizationService;

    @PostMapping
    public ResponseEntity<DetectionResponse> detect(@RequestBody DetectionRequest request) {
        List<SensitiveDataMatch> matches = detectionService.detect(request.content());
        
        String username = SecurityContextHolder.getContext().getAuthentication() != null ? 
                SecurityContextHolder.getContext().getAuthentication().getName() : "anonymous";
                
        int score = scoringService.calculateScore(matches, username);
        Status action = scoringService.determineAction(score);
        String anonymizedContent = anonymizationService.anonymize(request.content(), matches);

        return ResponseEntity.ok(new DetectionResponse(
                score,
                matches,
                anonymizedContent,
                action
        ));
    }
}
