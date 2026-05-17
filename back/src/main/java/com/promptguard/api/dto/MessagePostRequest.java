package com.promptguard.api.dto;

public record MessagePostRequest(
        String content,
        String sender,
        String senderRole,
        String senderAvatar
) {}
