package com.promptguard.api.dto;

public record RegisterRequest(
        String name,
        String email,
        String password,
        String department
) {}
