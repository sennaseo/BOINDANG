package com.boindang.campaign.presentation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boindang.campaign.infrastructure.kafka.producer.KafkaProducerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
@Tag(name = "Kafka 테스트", description = "Kafka 메시지 전송 테스트 API")
public class KafkaTestController {

	private final KafkaProducerService kafkaProducer;

	@Operation(summary = "Kafka 메시지 전송", description = "지정된 Kafka 토픽(test-topic)에 메시지를 전송합니다.")
	@GetMapping("/send")
	public ResponseEntity<String> sendMessage(
		@Parameter(description = "전송할 메시지", example = "hello kafka")
		@RequestParam String message
	) {
		kafkaProducer.send("test-topic", message);
		return ResponseEntity.ok("✅ 메시지 전송 완료!");
	}
}
