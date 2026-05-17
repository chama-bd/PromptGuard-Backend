package com.promptguard.api.controller;

import com.promptguard.api.service.EventService;
import com.promptguard.api.service.OllamaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;
    private final OllamaService ollamaService;

    @GetMapping("/live")
    public SseEmitter liveIncidents() {
        return eventService.subscribe();
    }

    @PostMapping("/chat/stream")
    public SseEmitter streamChat(@RequestBody java.util.Map<String, String> request) {
        String prompt = request.getOrDefault("prompt", "");
        SseEmitter emitter = new SseEmitter(0L); // Timeout infini
        ollamaService.streamResponse(prompt, emitter);
        return emitter;
    }
}
