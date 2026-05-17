package com.promptguard.api.repository;

import com.promptguard.api.model.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, UUID> {
    // Permettra de récupérer le portfolio d'un employé précis
    List<PortfolioItem> findByEmployeeId(UUID employeeId);
}