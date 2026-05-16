package com.promptguard.api.controller;

import com.promptguard.api.dto.DashboardStats;
import com.promptguard.api.dto.PromptLogDto;
import com.promptguard.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/logs")
    public ResponseEntity<List<PromptLogDto>> getLogs() {

        return ResponseEntity.ok(dashboardService.getAllLogs());
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {

        return ResponseEntity.ok(dashboardService.getStats());
    }
}
