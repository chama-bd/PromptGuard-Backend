package com.promptguard.api.config;

import com.promptguard.api.model.Employee;
import com.promptguard.api.model.Role;
import com.promptguard.api.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (employeeRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode("password123");

            Employee dev = Employee.builder()
                    .name("Alice Dev")
                    .email("alice@promptguard.local")
                    .password(encodedPassword)
                    .department("IT_DEV")
                    .role(Role.ROLE_USER)
                    .build();

            Employee hr = Employee.builder()
                    .name("Bob HR")
                    .email("bob@promptguard.local")
                    .password(encodedPassword)
                    .department("HR")
                    .role(Role.ROLE_USER)
                    .build();

            Employee legal = Employee.builder()
                    .name("Charlie Legal")
                    .email("charlie@promptguard.local")
                    .password(encodedPassword)
                    .department("LEGAL")
                    .role(Role.ROLE_USER)
                    .build();

            Employee rssi = Employee.builder()
                    .name("Admin RSSI")
                    .email("rssi@promptguard.enterprise")
                    .password(encodedPassword)
                    .department("SECURITY")
                    .role(Role.ROLE_RSSI)
                    .build();

            employeeRepository.saveAll(List.of(dev, hr, legal, rssi));
            System.out.println("✅ 4 Demo accounts created (password: password123)");
            System.out.println("   - RSSI: rssi@promptguard.enterprise");
            System.out.println("   - Users: alice, bob, charlie");
        }
    }
}
