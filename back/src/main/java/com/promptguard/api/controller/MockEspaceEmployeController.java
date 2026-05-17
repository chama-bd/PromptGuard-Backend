package com.promptguard.api.controller;

import com.promptguard.api.dto.CreateTaskDTO;
import com.promptguard.api.dto.TaskDTO;
import com.promptguard.api.service.MockEspaceEmployeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
        // On convertit le String reçu du Front en UUID Java
        UUID id = UUID.fromString(employeeId);

        // On appelle le service avec le vrai ID
        return ResponseEntity.ok(mockService.getActualPlannerTasks(id));
    }
    // À ajouter dans ton MockEspaceEmployeController :

    @PostMapping("/planner")
    public ResponseEntity<TaskDTO> createTask(@RequestBody CreateTaskDTO dto) {
        // On appelle le service pour enregistrer la tâche et on renvoie un statut 200 OK
        return ResponseEntity.ok(mockService.createTask(dto));
    }
    @PatchMapping("/planner/{taskId}/advance")
    public ResponseEntity<TaskDTO> advanceTaskStatus(@PathVariable Long taskId) {
        return ResponseEntity.ok(mockService.advanceTaskStatus(taskId));
    }

}