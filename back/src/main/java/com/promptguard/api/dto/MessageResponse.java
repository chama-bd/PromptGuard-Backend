package com.promptguard.api.dto;

import com.promptguard.api.model.ChatMessage;
import java.util.List;

public record MessageResponse(
        boolean success,
        boolean warning,
        String reason,
        List<SensitiveDataMatch> matches,
        ChatMessage message
) {}
