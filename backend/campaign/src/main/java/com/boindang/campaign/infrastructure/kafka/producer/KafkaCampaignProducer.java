package com.boindang.campaign.infrastructure.kafka.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.boindang.campaign.common.exception.CampaignException;
import com.boindang.campaign.presentation.dto.response.ApplyEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.boindang.campaign.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class KafkaCampaignProducer {

	private final KafkaTemplate<String, String> kafkaTemplate;
	private final ObjectMapper objectMapper;

	public void send(String topic, ApplyEvent event) {
		try {
			String json = objectMapper.writeValueAsString(event);
			kafkaTemplate.send(topic, json);
		} catch (JsonProcessingException e) {
			throw new CampaignException(ErrorCode.KAFKA_SEND_FAILED);
		}
	}
}
