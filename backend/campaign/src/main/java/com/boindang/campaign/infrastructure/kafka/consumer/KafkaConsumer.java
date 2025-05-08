package com.boindang.campaign.infrastructure.kafka.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.boindang.campaign.application.CampaignSaveService;
import com.boindang.campaign.presentation.dto.response.ApplyEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class KafkaConsumer {

	private final CampaignSaveService saveService;
	private final ObjectMapper objectMapper;

	@KafkaListener(topics = "apply-campaign", groupId = "campaign-group")
	public void consume(String message) {
		try {
			ApplyEvent event = objectMapper.readValue(message, ApplyEvent.class);
			saveService.save(event);
		} catch (Exception e) {
			log.error("Kafka 소비 중 예외 발생", e);
		}
	}
}

