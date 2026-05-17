package com.promptguard.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_chat_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String title;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
