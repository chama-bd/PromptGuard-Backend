package com.promptguard.api.service;

import com.promptguard.api.dto.PromptCreationDto;
import com.promptguard.api.dto.PromptDto;
import com.promptguard.api.dto.PromptStatsDto;
import com.promptguard.api.model.Employee;
import com.promptguard.api.model.Prompt;
import com.promptguard.api.repository.EmployeeRepository;
import com.promptguard.api.repository.PromptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromptService {

    private final PromptRepository promptRepository;
    private final EmployeeRepository employeeRepository;

    @Transactional
    public PromptDto createPrompt(PromptCreationDto dto) {
        // Fetch employee to ensure it exists
        Employee employee = employeeRepository.findById(dto.employeeId())
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

        Prompt prompt = Prompt.builder()
                .employee(employee)
                .content(dto.content())
                .riskScore(dto.riskScore())
                .dataTypes(dto.dataTypes())
                .build();

        Prompt savedPrompt = promptRepository.save(prompt);

        return mapToDto(savedPrompt);
    }

    @Transactional(readOnly = true)
    public Page<PromptDto> getPromptsByEmployee(UUID employeeId, Pageable pageable) {
        return promptRepository.findByEmployeeId(employeeId, pageable)
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public PromptStatsDto getStats() {
        long total = promptRepository.count();
        Double avgRiskRaw = promptRepository.getAverageRiskScore();
        double avgRisk = avgRiskRaw != null ? avgRiskRaw : 0.0;

        List<String> allDataTypes = promptRepository.findAllDataTypes();
        // dataTypes could be comma separated like "AWS_KEY,EMAIL"
        List<String> topDataTypes = allDataTypes.stream()
                .flatMap(dt -> Arrays.stream(dt.split(",")))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return new PromptStatsDto(total, avgRisk, topDataTypes);
    }

    private PromptDto mapToDto(Prompt prompt) {
        return new PromptDto(
                prompt.getId(),
                prompt.getEmployee().getId(),
                prompt.getContent(),
                prompt.getRiskScore(),
                prompt.getDataTypes(),
                prompt.getTimestamp()
        );
    }
}
