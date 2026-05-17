package com.promptguard.api.service;

import com.promptguard.api.dto.EmployeePortfolioDTO;
import com.promptguard.api.dto.ProjectDTO;
import com.promptguard.api.model.Project;
import com.promptguard.api.model.Task;
import com.promptguard.api.repository.ProjectRepository;
import com.promptguard.api.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public PortfolioService(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    public EmployeePortfolioDTO getEmployeePortfolio(UUID employeeId, String employeeName) {
        // 1. Récupérer tous les projets de l'employé
        List<Project> allProjects = projectRepository.findByEmployeeId(employeeId);

        // Séparer les projets en cours et terminés
        List<ProjectDTO> active = allProjects.stream()
                .filter(p -> "IN_PROGRESS".equalsIgnoreCase(p.getStatus()))
                .map(p -> new ProjectDTO(p.getId(), p.getName(), p.getDescription(), p.getRepositoryUrl(), p.getStatus()))
                .collect(Collectors.toList());

        List<ProjectDTO> completed = allProjects.stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()))
                .map(p -> new ProjectDTO(p.getId(), p.getName(), p.getDescription(), p.getRepositoryUrl(), p.getStatus()))
                .collect(Collectors.toList());

        // 2. LOGIQUE INTELLIGENTE : Détecter les compétences via les tâches du Planner
        List<Task> employeeTasks = taskRepository.findByEmployeeId(employeeId);
        List<String> skills = new ArrayList<>();

        for (Task task : employeeTasks) {
            String content = (task.getTitle() + " " + task.getDescription()).toLowerCase();

            // Simulation d'analyse de texte
            if (content.contains("leak") || content.contains("java") || content.contains("spring")) {
                if (!skills.contains("Java Spring Boot")) skills.add("Java Spring Boot");
            }
            if (content.contains("security") || content.contains("conformité") || content.contains("promptguard")) {
                if (!skills.contains("AI Security & Compliance")) skills.add("AI Security & Compliance");
            }
            if (content.contains("api") || content.contains("controller")) {
                if (!skills.contains("Architecture REST API")) skills.add("Architecture REST API");
            }
            if (content.contains("front") || content.contains("react") || content.contains("interface")) {
                if (!skills.contains("React.js / Tailwind")) skills.add("React.js / Tailwind");
            }
        }

        // Si aucune tâche, on met des compétences par défaut pour le rendu front
        if (skills.isEmpty()) {
            skills.add("Git / GitHub");
            skills.add("Software Engineering");
        }

        return new EmployeePortfolioDTO(employeeId, employeeName, active, completed, skills);
    }
}