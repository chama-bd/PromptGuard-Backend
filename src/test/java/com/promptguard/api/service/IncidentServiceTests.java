package com.promptguard.api.service;

import com.promptguard.api.model.IncidentAction;
import com.promptguard.api.model.IncidentSeverity;
import com.promptguard.api.model.Status;
import com.promptguard.api.repository.SecurityIncidentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;

@SpringBootTest
class IncidentServiceTests {

    @Autowired
    private SecurityIncidentService incidentService;

    @MockBean
    private SecurityIncidentRepository repository;

    @MockBean
    private NotificationService notificationService;

    @Test
    void testCriticalIncidentTrigger() {
        incidentService.logIncident(
                "john_doe",
                "/api/prompts",
                Collections.emptyList(),
                95,
                Status.BLOCKED
        );

        // Vérifier que l'incident est sauvegardé
        verify(repository, atLeastOnce()).saveAndFlush(any());
        
        // Vérifier que la notification RSSI est envoyée
        verify(notificationService, atLeastOnce()).sendCriticalEmail(any(), any());
    }
}
