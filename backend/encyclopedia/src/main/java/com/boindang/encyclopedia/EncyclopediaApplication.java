package com.boindang.encyclopedia;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@OpenAPIDefinition(
		info = @Info(title = "보인당 백과사전 API", version = "v1", description = "보인당 API 명세서")
)
@EnableScheduling
@SpringBootApplication
public class EncyclopediaApplication {

	public static void main(String[] args) {
		SpringApplication.run(EncyclopediaApplication.class, args);
	}

}
