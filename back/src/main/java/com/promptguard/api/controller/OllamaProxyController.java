package com.promptguard.api.controller;

import com.promptguard.api.service.OllamaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ollama")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OllamaProxyController {

    private final OllamaService ollamaService;

    @PostMapping("/proxy")
    public ResponseEntity<Map<String, String>> proxyToOllama(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        
        if (prompt == null || prompt.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }
        
        String response = ollamaService.generateResponse(prompt);
        return ResponseEntity.ok(Map.of("response", response));
    }
}
