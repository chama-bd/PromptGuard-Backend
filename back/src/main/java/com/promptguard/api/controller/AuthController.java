package com.promptguard.api.controller;

import com.promptguard.api.dto.LoginRequest;
import com.promptguard.api.dto.LoginResponse;
import com.promptguard.api.model.Employee;
import com.promptguard.api.repository.EmployeeRepository;
import com.promptguard.api.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Employee employee = employeeRepository.findByEmail(request.email())
                .orElse(null);

        if (employee != null && passwordEncoder.matches(request.password(), employee.getPassword())) {
            String token = jwtUtil.generateToken(employee.getEmail(), employee.getId().toString(), employee.getDepartment(), employee.getRole().name());
            return ResponseEntity.ok(new LoginResponse(
                    token,
                    employee.getId(),
                    employee.getName(),
                    employee.getDepartment(),
                    employee.getRole().name()
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
