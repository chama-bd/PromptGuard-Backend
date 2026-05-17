package com.promptguard.api.service;

import com.promptguard.api.dto.CreateTaskDTO;
import com.promptguard.api.dto.TaskDTO;
import com.promptguard.api.model.Employee;
import com.promptguard.api.model.Task;
import com.promptguard.api.model.TaskStatus;
import com.promptguard.api.repository.EmployeeRepository;
import com.promptguard.api.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class MockEspaceEmployeService{

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public List<TaskDTO> getActualPlannerTasks(UUID employeeId) {
        // 1. On récupère les vraies entités Task depuis PostgreSQL pour cet employé
        List<Task> tasksFromDb = taskRepository.findByEmployeeId(employeeId);

        // 2. On transforme proprement la liste en DTO
        return tasksFromDb.stream()
                .map(task -> new TaskDTO(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getDeadline(),
                        task.getPriority(),
                        task.getStatus().name()
                ))
                .collect(Collectors.toList());
    }
    @Transactional
    // À ajouter dans ton MockEspaceEmployeService :

    public TaskDTO createTask(CreateTaskDTO dto) {
        // 1. On récupère l'employé en base de données pour l'associer à la tâche
        Employee employee = employeeRepository.findById(dto.employeeId())
                .orElseThrow(() -> new RuntimeException("Employé non trouvé avec l'ID : " + dto.employeeId()));

        // 2. On crée l'entité Task à partir des infos du Front
        Task task = new Task();
        task.setTitle(dto.title());
        task.setDescription(dto.description());
        task.setDeadline(dto.deadline());
        task.setPriority(dto.priority());
        task.setStatus(TaskStatus.TO_DO); // <--- L'événement commence direct à l'état "À faire" (Bouton Commencer)
        task.setEmployee(employee);       // On fait le lien ManyToOne

        // 3. On sauvegarde dans PostgreSQL
        Task savedTask = taskRepository.save(task);

        // 4. On renvoie le TaskDTO tout propre au Front-end
        return new TaskDTO(
                savedTask.getId(),
                savedTask.getTitle(),
                savedTask.getDescription(),
                savedTask.getDeadline(),
                savedTask.getPriority(),
                savedTask.getStatus().name()
        );
    }
    public TaskDTO advanceTaskStatus(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));

        // Logique de transition d'état :
        if (task.getStatus() == TaskStatus.TO_DO) {
            task.setStatus(TaskStatus.IN_PROGRESS); // Commencer -> En cours
        } else if (task.getStatus() == TaskStatus.IN_PROGRESS) {
            task.setStatus(TaskStatus.DONE);        // Terminer -> Fait
        }

        Task updatedTask = taskRepository.save(task);

        return new TaskDTO(
                updatedTask.getId(),
                updatedTask.getTitle(),
                updatedTask.getDescription(),
                updatedTask.getDeadline(),
                updatedTask.getPriority(),
                updatedTask.getStatus().name()
        );
    }

}