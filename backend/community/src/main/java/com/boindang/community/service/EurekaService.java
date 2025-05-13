package com.boindang.community.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.ServiceInstance;

@Service
public class EurekaService {

	@Autowired
	private DiscoveryClient discoveryClient;

	public String getUrl(String service) {
		return discoveryClient.getInstances(service)
			.stream()
			.findFirst()
			.map(ServiceInstance::getUri)
			.map(Object::toString)
			.orElseThrow(() -> new RuntimeException("서비스 인스턴스를 찾을 수 없습니다: " + service));
	}
}
