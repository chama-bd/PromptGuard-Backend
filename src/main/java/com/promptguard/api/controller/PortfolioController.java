package com.promptguard.api.controller;

import com.promptguard.api.dto.EmployeePortfolioDTO;
import com.promptguard.api.service.PortfolioService;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    // 1. Endpoint pour que Doha affiche le Portfolio sur le Front-end
    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeePortfolioDTO> getPortfolio(@PathVariable UUID employeeId) {
        // Pour le hackathon, on passe un nom par défaut "Alex Lao" (ou tu peux le chercher via ton EmployeeRepository)
        return ResponseEntity.ok(portfolioService.getEmployeePortfolio(employeeId, "Alex Lao"));
    }

    // 2. Endpoint pour le bouton "Exporter en PDF"
    @GetMapping("/{employeeId}/export")
    public void exportToPDF(@PathVariable UUID employeeId, HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=portfolio_" + employeeId + ".pdf";
        response.setHeader(headerKey, headerValue);

        // Récupération des données réelles
        EmployeePortfolioDTO portfolio = portfolioService.getEmployeePortfolio(employeeId, "Alex Lao");

        // Génération du document PDF à la volée
        Document document = new Document();
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // Polices de caractères
        Font titleFont = new Font(Font.HELVETICA, 22, Font.BOLD);
        Font sectionFont = new Font(Font.HELVETICA, 14, Font.BOLD);
        Font bodyFont = new Font(Font.HELVETICA, 11, Font.NORMAL);

        // Contenu du PDF
        document.add(new Paragraph("PORTFOLIO PROFESSIONNEL AUTOMATISÉ", titleFont));
        document.add(new Paragraph("Généré par PromptGuard AI\n\n", bodyFont));

        document.add(new Paragraph("Collaborateur : " + portfolio.employeeName(), sectionFont));
        document.add(new Paragraph("ID Unique : " + portfolio.employeeId() + "\n\n", bodyFont));

        // Section Compétences
        document.add(new Paragraph("COMPÉTENCES DÉTECTÉES (VIA LE PLANNER)", sectionFont));
        for (String skill : portfolio.detectedSkills()) {
            document.add(new Paragraph("- " + skill, bodyFont));
        }
        document.add(new Paragraph("\n"));

        // Section Projets Réalisés
        document.add(new Paragraph("PROJETS RÉALISÉS", sectionFont));
        if (portfolio.completedProjects().isEmpty()) {
            document.add(new Paragraph("Aucun projet complété pour le moment.", bodyFont));
        } else {
            portfolio.completedProjects().forEach(p -> {
                document.add(new Paragraph(p.name() + " (" + p.repositoryUrl() + ")", bodyFont));
                document.add(new Paragraph("Description : " + p.description() + "\n", bodyFont));
            });
        }
        document.add(new Paragraph("\n"));

        // Section Projets en Cours
        document.add(new Paragraph("PROJETS EN COURS (GIT)", sectionFont));
        if (portfolio.activeProjects().isEmpty()) {
            document.add(new Paragraph("Aucun projet en cours.", bodyFont));
        } else {
            portfolio.activeProjects().forEach(p -> {
                document.add(new Paragraph(p.name() + " (" + p.repositoryUrl() + ")", bodyFont));
                document.add(new Paragraph("Description : " + p.description() + "\n", bodyFont));
            });
        }

        document.close();
    }
}