package com.promptguard.api.dto;

public record ProjectDTO(
        Long id,
        String name,
        String description,
        String repositoryUrl,
        String status
) {}