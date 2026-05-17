package com.promptguard.api.service;

import com.promptguard.api.model.AiChatMessage;
import com.promptguard.api.model.AiChatSession;
import com.promptguard.api.repository.AiChatMessageRepository;
import com.promptguard.api.repository.AiChatSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiChatService {

    private final AiChatSessionRepository aiChatSessionRepository;
    private final AiChatMessageRepository aiChatMessageRepository;

    public List<AiChatSession> getSessionsForUser(String userName) {
        return aiChatSessionRepository.findByUserNameOrderByCreatedAtDesc(userName);
    }

    public List<AiChatMessage> getMessagesForSession(Long sessionId) {
        return aiChatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }

    @Transactional
    public AiChatSession createSession(String userName, String title) {
        log.info("Création d'une nouvelle session de discussion IA pour {} : '{}'", userName, title);
        AiChatSession session = AiChatSession.builder()
                .userName(userName)
                .title(title != null && !title.isBlank() ? title : "Nouvelle Discussion")
                .build();
        return aiChatSessionRepository.save(session);
    }

    @Transactional
    public void saveMessages(Long sessionId, String userPrompt, String aiResponse) {
        AiChatSession session = aiChatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session IA non trouvée : " + sessionId));

        log.info("Sauvegarde des messages de la session IA {}", sessionId);

        // Mettre à jour le titre de la session si elle a son titre générique d'origine
        if ("Nouvelle Discussion".equals(session.getTitle()) && userPrompt != null && !userPrompt.isBlank()) {
            String newTitle = userPrompt.length() > 35 ? userPrompt.substring(0, 32) + "..." : userPrompt;
            session.setTitle(newTitle);
            aiChatSessionRepository.save(session);
        }

        // Sauvegarder le message de l'utilisateur
        AiChatMessage userMsg = AiChatMessage.builder()
                .session(session)
                .role("user")
                .content(userPrompt)
                .timestamp(LocalDateTime.now().minusSeconds(1))
                .build();
        aiChatMessageRepository.save(userMsg);

        // Sauvegarder le message de l'IA (réponse)
        AiChatMessage aiMsg = AiChatMessage.builder()
                .session(session)
                .role("ai")
                .content(aiResponse)
                .timestamp(LocalDateTime.now())
                .build();
        aiChatMessageRepository.save(aiMsg);
    }
}
