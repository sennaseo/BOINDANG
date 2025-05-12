package com.boindang.community.common.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class AppConfig {
	@Bean
	@LoadBalanced
	public RestClient restClient() {
		return RestClient.builder().build();
	}
}
