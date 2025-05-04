package com.boindang.encyclopedia.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories(basePackages = "com.boindang.encyclopedia.infrastructure")
public class ElasticsearchConfig {
}
