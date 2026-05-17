package com.promptguard.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CreateTaskDTO(
        String title,
        String description,
        LocalDateTime deadline,
        String priority,
        UUID employeeId // Pour savoir à quel employé on attribue cette tâche/événement
) {}