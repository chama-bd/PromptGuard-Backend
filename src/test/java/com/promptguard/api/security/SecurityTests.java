package com.promptguard.api.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class SecurityTests {

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void testTokenGenerationAndExtraction() {
        String email = "test@promptguard.com";
        String id = "123";
        String dept = "IT";
        String role = "ROLE_RSSI";

        String token = jwtUtil.generateToken(email, id, dept, role);
        assertNotNull(token);

        assertEquals(email, jwtUtil.extractEmail(token));
        assertEquals(role, jwtUtil.extractRole(token));
    }

    @Test
    void testTokenValidation() {
        String email = "test@promptguard.com";
        String token = jwtUtil.generateToken(email, "1", "D", "ROLE_USER");
        
        assertTrue(jwtUtil.validateToken(token, email));
        assertFalse(jwtUtil.validateToken(token, "wrong@email.com"));
    }
}
