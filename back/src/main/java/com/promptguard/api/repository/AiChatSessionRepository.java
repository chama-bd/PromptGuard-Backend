package com.promptguard.api.repository;

import com.promptguard.api.model.AiChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiChatSessionRepository extends JpaRepository<AiChatSession, Long> {
    List<AiChatSession> findByUserNameOrderByCreatedAtDesc(String userName);
}
