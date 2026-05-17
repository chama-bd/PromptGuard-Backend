package com.promptguard.api.service;

import com.promptguard.api.dto.MessageResponse;
import com.promptguard.api.dto.SensitiveDataMatch;
import com.promptguard.api.model.Channel;
import com.promptguard.api.model.ChatMessage;
import com.promptguard.api.repository.ChannelRepository;
import com.promptguard.api.repository.ChatMessageRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessagingService {

    private final ChannelRepository channelRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final DetectionService detectionService;

    @PostConstruct
    @Transactional
    public void initDemoData() {
        if (channelRepository.count() == 0) {
            log.info("Initialisation des salons de discussion par défaut (Workspace)...");

            Channel general = channelRepository.save(Channel.builder().name("general").type("public").build());
            Channel securityAlerts = channelRepository.save(Channel.builder().name("security-alerts").type("protected").build());
            Channel engineeringCore = channelRepository.save(Channel.builder().name("engineering-core").type("private").build());
            Channel aiCompliance = channelRepository.save(Channel.builder().name("ai-compliance").type("protected").build());
            Channel random = channelRepository.save(Channel.builder().name("random").type("public").build());

            log.info("Initialisation de l'historique des messages pour #security-alerts...");
            
            chatMessageRepository.save(ChatMessage.builder()
                    .content("Équipe, assurez-vous que tous les déploiements locaux Llama-3 utilisent la nouvelle passerelle d'entreprise. Nous avons détecté une fuite potentielle dans un environnement de développement aujourd'hui.")
                    .sender("Sarah Chen")
                    .senderRole("Chef Sécurité")
                    .senderAvatar("https://ui-avatars.com/api/?name=Sarah+Chen&background=7239EA&color=fff&bold=true")
                    .type("text")
                    .timestamp(LocalDateTime.now().minusMinutes(35))
                    .channel(securityAlerts)
                    .build());

            chatMessageRepository.save(ChatMessage.builder()
                    .content("Bien reçu. J'ai déjà patché le VPC interne. Voici le diagramme d'architecture mis à jour.")
                    .sender("Marc Durand")
                    .senderRole("ML Ops")
                    .senderAvatar("https://ui-avatars.com/api/?name=Marc+Durand&background=50CD89&color=fff&bold=true")
                    .type("file")
                    .fileName("security_infra_v4.pdf")
                    .fileSize("4.2 Mo")
                    .timestamp(LocalDateTime.now().minusMinutes(31))
                    .channel(securityAlerts)
                    .build());

            chatMessageRepository.save(ChatMessage.builder()
                    .content("Résumé d'Intelligence : L'équipe patche activement les environnements de dev. Niveau de Sécurité : Élevé. Aucune donnée sensible n'a quitté le VPC.")
                    .sender("PromptGuard AI")
                    .senderRole("Système")
                    .senderAvatar("https://ui-avatars.com/api/?name=PG+AI&background=009EF7&color=fff&bold=true")
                    .type("ai-insight")
                    .timestamp(LocalDateTime.now().minusMinutes(30))
                    .channel(securityAlerts)
                    .build());

            log.info("Initialisation réussie !");
        }
    }

    public List<Channel> getAllChannels() {
        return channelRepository.findAll();
    }

    public List<ChatMessage> getMessagesForChannel(Long channelId) {
        return chatMessageRepository.findByChannelIdOrderByTimestampAsc(channelId);
    }

    @Transactional
    public MessageResponse postMessage(Long channelId, String content, String sender, String senderRole, String senderAvatar) {
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new IllegalArgumentException("Channel non trouvé !"));

        // 1. Analyse de sécurité
        List<SensitiveDataMatch> matches = detectionService.detect(content);
        if (!matches.isEmpty()) {
            // Fuite détectée : on bloque l'enregistrement !
            log.warn("Tentative de publication de données sensibles bloquée dans le canal {} par {} !", channel.getName(), sender);
            String reason = matches.get(0).type().name() + " détecté(e)";
            return new MessageResponse(false, true, reason, matches, null);
        }

        // 2. Si tout est propre, on persiste le message
        ChatMessage message = ChatMessage.builder()
                .content(content)
                .sender(sender)
                .senderRole(senderRole != null ? senderRole : "Employé")
                .senderAvatar(senderAvatar != null ? senderAvatar : "https://ui-avatars.com/api/?name=" + sender.replace(" ", "+"))
                .type("text")
                .timestamp(LocalDateTime.now())
                .channel(channel)
                .build();

        message = chatMessageRepository.save(message);
        return new MessageResponse(true, false, null, List.of(), message);
    }
}
