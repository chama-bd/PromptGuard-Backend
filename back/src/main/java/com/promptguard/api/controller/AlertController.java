package com.promptguard.api.controller;

import com.promptguard.api.dto.AlertCreationDto;
import com.promptguard.api.dto.AlertDto;
import com.promptguard.api.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping
    public ResponseEntity<AlertDto> createAlert(@RequestBody AlertCreationDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alertService.createAlert(dto));
    }

    @GetMapping(value = "/live", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter liveAlerts() {
        return alertService.subscribeLiveAlerts();
    }
}
