package com.promptguard.api.controller;

import com.promptguard.api.dto.PortfolioItemDTO;
import com.promptguard.api.dto.TaskDTO;
import com.promptguard.api.service.MockEspaceEmployeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mock")
@CrossOrigin(origins = "*")
public class MockEspaceEmployeController {

    private final MockEspaceEmployeService mockService;

    // Injection du service via le constructeur
    public MockEspaceEmployeController(MockEspaceEmployeService mockService) {
        this.mockService = mockService;
    }

    @GetMapping("/planner/{employeeId}")
    public ResponseEntity<List<TaskDTO>> getMockPlanner(@PathVariable String employeeId) {
        // Le contrôleur délègue totalement le traitement au service
        return ResponseEntity.ok(mockService.getMockPlannerTasks());
    }

    @GetMapping("/portfolio/{employeeId}")
    public ResponseEntity<List<PortfolioItemDTO>> getMockPortfolio(@PathVariable String employeeId) {
        // Idem ici
        return ResponseEntity.ok(mockService.getMockPortfolioItems());
    }
}