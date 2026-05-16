package com.promptguard.api.controller;

import com.promptguard.api.dto.SecurityAnalyticsDto;
import com.promptguard.api.dto.SecurityIncidentDto;
import com.promptguard.api.service.SecurityIncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SecurityAnalyticsController {

    private final SecurityIncidentService securityIncidentService;

    @GetMapping("/incidents")
    public ResponseEntity<List<SecurityIncidentDto>> getAllIncidents() {
        return ResponseEntity.ok(securityIncidentService.getRecentIncidentDtos());
    }

    @GetMapping("/analytics")
    public ResponseEntity<SecurityAnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(securityIncidentService.getAnalytics());
    }
}
