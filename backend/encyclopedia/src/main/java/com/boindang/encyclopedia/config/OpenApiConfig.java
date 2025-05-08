package com.boindang.encyclopedia.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Encyclopedia API")
                        .version("v1"))
                .servers(List.of(
                        new Server().url("http://encyclopedia:8081")  // 👈 내부 서비스 주소 or 원하는 Gateway 주소
                ));
    }
}