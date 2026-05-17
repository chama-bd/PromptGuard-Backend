package com.promptguard.api.controller;

import com.promptguard.api.dto.PromptCreationDto;
import com.promptguard.api.dto.PromptDto;
import com.promptguard.api.dto.PromptStatsDto;
import com.promptguard.api.service.PromptService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/prompts")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PromptController {

    private final PromptService promptService;

    @PostMapping
    public ResponseEntity<PromptDto> createPrompt(@RequestBody PromptCreationDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promptService.createPrompt(dto));
    }

    @GetMapping
    public ResponseEntity<Page<PromptDto>> getPromptsByEmployee(
            @RequestParam UUID employeeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        return ResponseEntity.ok(promptService.getPromptsByEmployee(employeeId, pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<PromptStatsDto> getStats() {
        return ResponseEntity.ok(promptService.getStats());
    }
}
