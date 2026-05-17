package com.promptguard.api.service;

import com.promptguard.api.model.SecurityIncident;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class EventService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    /**
     * Abonner un client au flux SSE d'incidents en temps réel.
     */
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(-1L); // Pas de timeout
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event().name("init").data("Connected to Live Incidents"));
        } catch (Exception e) {
            emitters.remove(emitter);
        }

        return emitter;
    }

    /**
     * Broadcaster un incident à tous les clients SSE connectés.
     */
    public void broadcast(SecurityIncident incident) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("incident")
                        .data(incident));
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        }
    }
}
