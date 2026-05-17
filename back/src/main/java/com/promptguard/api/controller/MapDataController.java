package com.promptguard.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "*")
public class MapDataController {

    @GetMapping("/map-data")
    public ResponseEntity<List<Map<String, Object>>> getMapData() {
        // Simulation de données géospatiales pour l'animation des arcs de la carte D3.js
        List<Map<String, Object>> mapData = List.of(
            Map.of(
                "source", Map.of("lat", 48.8566, "lng", 2.3522, "name", "Paris (User)"),
                "target", Map.of("lat", 38.8951, "lng", -77.0364, "name", "US-East (AWS)"),
                "severity", "CRITICAL",
                "threatType", "AWS_KEY"
            ),
            Map.of(
                "source", Map.of("lat", 51.5074, "lng", -0.1278, "name", "London (User)"),
                "target", Map.of("lat", 37.7749, "lng", -122.4194, "name", "US-West (OpenAI)"),
                "severity", "HIGH",
                "threatType", "OPENAI_KEY"
            ),
            Map.of(
                "source", Map.of("lat", 35.6895, "lng", 139.6917, "name", "Tokyo (User)"),
                "target", Map.of("lat", 53.3498, "lng", -6.2603, "name", "EU-West (Stripe)"),
                "severity", "MEDIUM",
                "threatType", "STRIPE_KEY"
            ),
            Map.of(
                "source", Map.of("lat", -33.8688, "lng", 151.2093, "name", "Sydney (User)"),
                "target", Map.of("lat", 1.3521, "lng", 103.8198, "name", "AP-South (DB)"),
                "severity", "CRITICAL",
                "threatType", "DB_CREDENTIAL"
            )
        );
        
        return ResponseEntity.ok(mapData);
    }
}
