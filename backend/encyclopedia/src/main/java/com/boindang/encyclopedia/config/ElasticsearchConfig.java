package com.boindang.encyclopedia.config;

import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.convert.ElasticsearchConverter;
import org.springframework.data.elasticsearch.core.convert.MappingElasticsearchConverter;
import org.springframework.data.elasticsearch.core.mapping.SimpleElasticsearchMappingContext;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;

@Configuration
public class ElasticsearchConfig {

    @Value("${spring.elasticsearch.uris}")
    private String elasticsearchUrl;

    @Bean
    public RestHighLevelClient restHighLevelClient() {
        HttpHost httpHost = HttpHost.create(elasticsearchUrl);
        return new RestHighLevelClient(RestClient.builder(httpHost));
    }

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        RestClient restClient = RestClient.builder(HttpHost.create(elasticsearchUrl)).build();

        ElasticsearchTransport transport = new RestClientTransport(
            restClient,
            new JacksonJsonpMapper()
        );

        return new ElasticsearchClient(transport);
    }

    @Bean(name = "elasticsearchTemplate")
    public ElasticsearchOperations elasticsearchOperations() {
        return new ElasticsearchTemplate(elasticsearchClient());
    }

}