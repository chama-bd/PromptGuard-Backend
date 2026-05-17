package com.promptguard.api.dto;

public record DepartmentIncidentDTO(
        String department,
        Long incidentCount
) {}