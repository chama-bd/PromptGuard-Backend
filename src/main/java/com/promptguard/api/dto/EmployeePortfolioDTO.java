package com.promptguard.api.dto;

import java.util.List;
import java.util.UUID;

public record EmployeePortfolioDTO(
        UUID employeeId,
        String employeeName,
        List<ProjectDTO> activeProjects,    // Projets en cours
        List<ProjectDTO> completedProjects, // Projets réalisés
        List<String> detectedSkills         // Compétences détectées automatiquement
) {}