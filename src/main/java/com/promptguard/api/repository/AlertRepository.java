package com.promptguard.api.repository;

import com.promptguard.api.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {
    List<Alert> findByEmployeeIdAndSeverityAndCreatedAtAfter(UUID employeeId, String severity, LocalDateTime createdAt);
}
