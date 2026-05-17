package com.promptguard.api.service;

import com.promptguard.api.dto.PortfolioItemDTO;
import com.promptguard.api.dto.TaskDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service // Cette annotation dit à Spring de gérer cette classe comme un composant de logique métier
public class MockEspaceEmployeService {

    public List<TaskDTO> getMockPlannerTasks() {
        List<TaskDTO> tasks = new ArrayList<>();

        tasks.add(new TaskDTO(
                1L,
                "Fix Critical Memory Leak",
                "Analyse et correction de la fuite mémoire détectée sur le composant de scoring",
                LocalDateTime.now().plusDays(1),
                "HIGH",
                false
        ));

        tasks.add(new TaskDTO(
                2L,
                "Review API Security Configuration",
                "Vérification des filtres de sécurité et de l'anonymisation des données",
                LocalDateTime.now().plusDays(3),
                "MEDIUM",
                true
        ));

        return tasks;
    }

    public List<PortfolioItemDTO> getMockPortfolioItems() {
        List<PortfolioItemDTO> portfolioItems = new ArrayList<>();

        portfolioItems.add(new PortfolioItemDTO(
                1L,
                "Refactor Dashboard Statistics",
                "COMMIT",
                "Optimisation des requêtes SQL et correction des relations asynchrones",
                LocalDateTime.now().minusHours(3)
        ));

        portfolioItems.add(new PortfolioItemDTO(
                2L,
                "Integration Tests for Core Moteur",
                "TASK",
                "Mise en place des tests automatisés pour la détection regex des clés AWS",
                LocalDateTime.now().minusDays(1)
        ));

        return portfolioItems;
    }
}