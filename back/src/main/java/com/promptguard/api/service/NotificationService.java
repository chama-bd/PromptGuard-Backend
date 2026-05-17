package com.promptguard.api.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final JavaMailSender mailSender;

    public void sendCriticalEmail(String rssiEmail, String incidentDetails) {
        log.warn("CRITICAL: Sending emergency email to RSSI: {}", rssiEmail);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("security@promptguard.enterprise");
            message.setTo(rssiEmail);
            message.setSubject("🚨 [CRITICAL] Security Incident Detected");
            message.setText("A high-risk security incident has been detected and automatically mitigated.\n\n" +
                    "Details:\n" + incidentDetails + "\n\n" +
                    "Please log in to the SOC Dashboard for immediate review.");
            
            // mailSender.send(message); // Uncomment when real SMTP is configured
            log.info("Email sent successfully (mocked in logs)");
        } catch (Exception e) {
            log.error("Failed to send critical email", e);
        }
    }

    public void sendSlackAlert(String channel, String message) {
        log.info("SLACK ALERT [Channel: {}]: {}", channel, message);
        // Simulation d'un webhook Slack
    }

    public void sendSms(String phoneNumber, String message) {
        log.info("SMS ALERT [To: {}]: {}", phoneNumber, message);
        // Simulation d'une intégration Twilio/Vonage
    }

    public void triggerEscalationSOC(String incidentId) {
        log.warn("SOC ESCALATION: Incident {} has been escalated to Tier 3 SOC Analysts.", incidentId);
    }
}
