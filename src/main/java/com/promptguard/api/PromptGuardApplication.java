package com.promptguard.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PromptGuardApplication {

	public static void main(String[] args) {
		SpringApplication.run(PromptGuardApplication.class, args);
	}

}
