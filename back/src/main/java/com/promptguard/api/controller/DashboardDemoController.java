package com.promptguard.api.controller;

import com.promptguard.api.service.DemoScenarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/demo")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardDemoController {

    private final DemoScenarioService demoScenarioService;

    @PostMapping("/trigger/{scenario}")
    public ResponseEntity<String> trigger(@PathVariable String scenario) {
        demoScenarioService.triggerScenario(scenario);
        return ResponseEntity.ok("Scenario " + scenario + " triggered.");
    }
}
