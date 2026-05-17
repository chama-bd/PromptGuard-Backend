package com.promptguard.api.controller;

import com.promptguard.api.dto.*;
import com.promptguard.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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

    /**
     * NOUVEL ENDPOINT AJOUTÉ
     * Récupère la liste propre des incidents regroupés par département
     */
    @GetMapping("/incidents-by-department")
    public ResponseEntity<List<DepartmentIncidentDTO>> getIncidentsByDepartment() {
        // Le contrôleur reste très propre et délègue au service
        return ResponseEntity.ok(dashboardService.getIncidentsStatsByDepartment());
    }
    @GetMapping("/employees/{id}/surveillance")
    public ResponseEntity<EmployeeRiskProfileDTO> getEmployeeSurveillance(@PathVariable String id) {
        return ResponseEntity.ok(dashboardService.getEmployeeRiskProfile(id));
    }
    @GetMapping("/employees/{id}/profile")
    public ResponseEntity<EmployeeProfileDTO> getEmployeeProfile(@PathVariable UUID id) {
        // On appelle la logique qu'on vient de coder dans le service
        EmployeeProfileDTO profile = dashboardService.getEmployeeProfile(id);

        // On renvoie le résultat au Front-end avec un statut HTTP 200 OK
        return ResponseEntity.ok(profile);
    }
}