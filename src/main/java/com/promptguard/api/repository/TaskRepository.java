package com.promptguard.api.repository;

import com.promptguard.api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    // Cette méthode te permettra plus tard de récupérer uniquement les tâches d'un employé précis
    List<Task> findByEmployeeId(UUID employeeId);
}