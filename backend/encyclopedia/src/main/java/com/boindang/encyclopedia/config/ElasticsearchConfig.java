package com.boindang.encyclopedia.config;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories(basePackages = "com.boindang.encyclopedia.infrastructure")
public class ElasticsearchConfig {
    @Value("${spring.elasticsearch.uris}") // application.yml에 정의된 변수 주입
    private String elasticsearchUrl;

    @Bean
    public RestHighLevelClient restHighLevelClient() {
        // elasticsearchUrl 변수를 사용하여 HttpHost 생성
        HttpHost httpHost = HttpHost.create(elasticsearchUrl);
        return new RestHighLevelClient(RestClient.builder(httpHost));
    }
}
