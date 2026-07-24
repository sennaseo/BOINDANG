package com.boindang.campaign.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

import lombok.extern.slf4j.Slf4j;

/**
 * Kafka Consumer 에러 처리 설정.
 *
 * 기존에는 리스너에서 예외가 발생하면 로그만 남고 메시지가 그대로 유실되었다.
 * DefaultErrorHandler + FixedBackOff로 1초 간격 3회까지 재시도하고,
 * 그래도 실패하면 (DLQ 토픽 발행 대신) 로그로 실패 사실을 남긴다.
 */
@Slf4j
@Configuration
public class KafkaConsumerConfig {

	@Value("${spring.kafka.bootstrap-servers}")
	private String bootstrapServers;

	@Value("${spring.kafka.consumer.group-id}")
	private String groupId;

	@Bean
	public ConsumerFactory<String, String> consumerFactory() {
		Map<String, Object> props = new HashMap<>();
		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
		props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
		return new DefaultKafkaConsumerFactory<>(props);
	}

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
		ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(consumerFactory());

		// 1초 간격으로 최대 3회 재시도 후 포기
		FixedBackOff backOff = new FixedBackOff(1000L, 3L);

		DefaultErrorHandler errorHandler = new DefaultErrorHandler((record, exception) -> {
			log.error("❗️[Kafka DLQ] 재시도 소진 - 메시지 유실됨. topic={}, partition={}, offset={}, value={}",
				record.topic(), record.partition(), record.offset(), record.value(), exception);
		}, backOff);

		factory.setCommonErrorHandler(errorHandler);
		return factory;
	}
}
