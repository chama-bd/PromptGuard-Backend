package com.promptguard.api.controller;

import com.promptguard.api.dto.MessagePostRequest;
import com.promptguard.api.dto.MessageResponse;
import com.promptguard.api.model.Channel;
import com.promptguard.api.model.ChatMessage;
import com.promptguard.api.service.MessagingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatMessageController {

    private final MessagingService messagingService;

    @GetMapping("/channels")
    public ResponseEntity<List<Channel>> getChannels() {
        return ResponseEntity.ok(messagingService.getAllChannels());
    }

    @GetMapping("/channels/{channelId}/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable Long channelId) {
        return ResponseEntity.ok(messagingService.getMessagesForChannel(channelId));
    }

    @PostMapping("/channels/{channelId}/messages")
    public ResponseEntity<MessageResponse> postMessage(
            @PathVariable Long channelId,
            @RequestBody MessagePostRequest request) {
        
        MessageResponse response = messagingService.postMessage(
                channelId,
                request.content(),
                request.sender(),
                request.senderRole(),
                request.senderAvatar()
        );

        if (!response.success() && response.warning()) {
            // On peut renvoyer un statut 400 ou garder un 200 avec warning: true pour que le front gère l'UX
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(response);
    }
}
