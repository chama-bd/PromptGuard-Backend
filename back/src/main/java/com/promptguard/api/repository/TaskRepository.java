package com.promptguard.api.repository;

import com.promptguard.api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> { // <-- On met Long ici !

    // Spring Data comprend qu'il doit chercher l'attribut 'id' dans l'objet 'employee' de la Task
    List<Task> findByEmployeeId(UUID employeeId);
}