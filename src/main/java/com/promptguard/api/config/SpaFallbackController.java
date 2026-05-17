package com.promptguard.api.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Catch-all controller for React SPA routing.
 * Any non-API, non-asset request gets served index.html
 * so that React Router can handle client-side navigation.
 */
@RestController
public class SpaFallbackController {

    @GetMapping(value = { "/login", "/dashboard", "/alerts", "/heatmap", "/reports",
                          "/employees", "/incidents", "/analytics", "/world-map",
                          "/chat", "/messaging", "/planner", "/briefing",
                          "/history", "/portfolio", "/profile" },
                produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<byte[]> spaFallback(HttpServletRequest request) throws IOException {
        Resource resource = new ClassPathResource("static/index.html");
        byte[] bytes = resource.getInputStream().readAllBytes();
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(bytes);
    }
}
