package com.promptguard.api.config;

import com.promptguard.api.model.Employee;
import com.promptguard.api.model.Role;
import com.promptguard.api.model.Project;
import com.promptguard.api.model.Task;
import com.promptguard.api.model.TaskStatus;
import com.promptguard.api.repository.EmployeeRepository;
import com.promptguard.api.repository.ProjectRepository;
import com.promptguard.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (employeeRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode("password123");

            Employee dev = Employee.builder()
                    .name("Alice Dev")
                    .email("alice@promptguard.local")
                    .password(encodedPassword)
                    .department("IT_DEV")
                    .role(Role.ROLE_USER)
                    .build();

            Employee hr = Employee.builder()
                    .name("Bob HR")
                    .email("bob@promptguard.local")
                    .password(encodedPassword)
                    .department("HR")
                    .role(Role.ROLE_USER)
                    .build();

            Employee legal = Employee.builder()
                    .name("Charlie Legal")
                    .email("charlie@promptguard.local")
                    .password(encodedPassword)
                    .department("LEGAL")
                    .role(Role.ROLE_USER)
                    .build();

            Employee rssi = Employee.builder()
                    .name("Admin RSSI")
                    .email("rssi@promptguard.enterprise")
                    .password(encodedPassword)
                    .department("SECURITY")
                    .role(Role.ROLE_RSSI)
                    .build();

            employeeRepository.saveAll(List.of(dev, hr, legal, rssi));

            // Seed projects for Alice Dev
            Project p1 = new Project();
            p1.setName("Sécurisation API Client");
            p1.setDescription("Mise en place de filtres anti-injection de prompts IA et détection automatique des données sensibles (RGPD).");
            p1.setRepositoryUrl("https://github.com/promptguard/api-client-sec");
            p1.setStatus("COMPLETED");
            p1.setEmployee(dev);

            Project p2 = new Project();
            p2.setName("Audit des Modèles LLM Internes");
            p2.setDescription("Analyse de vulnérabilité aux attaques d'extraction de données et de contournement des politiques (jailbreaking).");
            p2.setRepositoryUrl("https://github.com/promptguard/llm-audit-v2");
            p2.setStatus("IN_PROGRESS");
            p2.setEmployee(dev);

            projectRepository.saveAll(List.of(p1, p2));

            // Seed tasks for Alice Dev
            Task t1 = new Task();
            t1.setTitle("Configurer les regex de détection de clés API");
            t1.setDescription("Détection de tokens GitHub et AWS dans les requêtes");
            t1.setDeadline(LocalDateTime.now().plusDays(2));
            t1.setPriority("HIGH");
            t1.setStatus(TaskStatus.TO_DO);
            t1.setEmployee(dev);

            Task t2 = new Task();
            t2.setTitle("Intégrer les filtres d'anonymisation de prénoms");
            t2.setDescription("Remplacer les prénoms par des placeholders anonymes");
            t2.setDeadline(LocalDateTime.now().plusDays(5));
            t2.setPriority("MEDIUM");
            t2.setStatus(TaskStatus.IN_PROGRESS);
            t2.setEmployee(dev);

            Task t3 = new Task();
            t3.setTitle("Rapport d'audit de sécurité GPT-4");
            t3.setDescription("Rédiger les conclusions du test de robustesse");
            t3.setDeadline(LocalDateTime.now().minusDays(1));
            t3.setPriority("LOW");
            t3.setStatus(TaskStatus.DONE);
            t3.setEmployee(dev);

            taskRepository.saveAll(List.of(t1, t2, t3));

            System.out.println("✅ 4 Demo accounts created (password: password123)");
            System.out.println("   - RSSI: rssi@promptguard.enterprise");
            System.out.println("   - Users: alice, bob, charlie");
            System.out.println("✅ Default projects and planner tasks seeded for Alice Dev.");
        }
    }
}
