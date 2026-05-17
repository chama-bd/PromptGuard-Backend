package com.promptguard.api.controller;

import com.promptguard.api.model.AiChatMessage;
import com.promptguard.api.model.AiChatSession;
import com.promptguard.api.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiChatController {

    private final AiChatService aiChatService;

    @GetMapping("/sessions")
    public ResponseEntity<List<AiChatSession>> getSessions(@RequestParam String userName) {
        return ResponseEntity.ok(aiChatService.getSessionsForUser(userName));
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<AiChatMessage>> getMessages(@PathVariable Long sessionId) {
        return ResponseEntity.ok(aiChatService.getMessagesForSession(sessionId));
    }

    @PostMapping("/sessions")
    public ResponseEntity<AiChatSession> createSession(@RequestBody Map<String, String> request) {
        String userName = request.getOrDefault("userName", "Employé");
        String title = request.getOrDefault("title", "Nouvelle Discussion");
        return ResponseEntity.ok(aiChatService.createSession(userName, title));
    }

    @PostMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<Void> saveMessage(
            @PathVariable Long sessionId,
            @RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String response = request.get("response");
        aiChatService.saveMessages(sessionId, prompt, response);
        return ResponseEntity.ok().build();
    }
}
