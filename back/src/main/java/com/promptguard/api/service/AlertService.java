package com.promptguard.api.service;

import com.promptguard.api.dto.AlertCreationDto;
import com.promptguard.api.dto.AlertDto;
import com.promptguard.api.model.Alert;
import com.promptguard.api.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribeLiveAlerts() {
        SseEmitter emitter = new SseEmitter(-1L); // No timeout for SSE connection
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        try {
            // Initial dummy event so the client knows it's connected
            emitter.send(SseEmitter.event().name("init").data("Connected to Live Alerts"));
        } catch (Exception e) {
            emitters.remove(emitter);
        }

        return emitter;
    }

    @Transactional
    public AlertDto createAlert(AlertCreationDto dto) {
        Alert alert = Alert.builder()
                .type(dto.type())
                .severity(dto.severity())
                .employeeId(dto.employeeId())
                .message(dto.message())
                .isGrouped(false)
                .build();

        Alert savedAlert = alertRepository.saveAndFlush(alert);
        AlertDto alertDto = mapToDto(savedAlert);

        // Grouping logic: si 3 alertes mineures du même employé en 1h -> grouper
        if ("MINOR".equalsIgnoreCase(dto.severity())) {
            LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
            List<Alert> recentMinors = alertRepository.findByEmployeeIdAndSeverityAndCreatedAtAfter(
                    dto.employeeId(), "MINOR", oneHourAgo);

            if (recentMinors.size() >= 3) {
                Alert groupedAlert = Alert.builder()
                        .type("GROUPED_ALERT")
                        .severity("MAJOR")
                        .employeeId(dto.employeeId())
                        .message("Alerte de groupe : " + recentMinors.size() + " alertes mineures détectées en moins d'1h. Escalade au niveau MAJOR.")
                        .isGrouped(true)
                        .build();

                Alert savedGrouped = alertRepository.saveAndFlush(groupedAlert);
                AlertDto groupedDto = mapToDto(savedGrouped);
                
                broadcast(groupedDto);
                return groupedDto;
            }
        }

        broadcast(alertDto);
        return alertDto;
    }

    private void broadcast(AlertDto alertDto) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("alert").data(alertDto));
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        }
    }

    private AlertDto mapToDto(Alert alert) {
        return new AlertDto(
                alert.getId(),
                alert.getType(),
                alert.getSeverity(),
                alert.getEmployeeId(),
                alert.getMessage(),
                alert.isGrouped(),
                alert.getCreatedAt()
        );
    }
}
