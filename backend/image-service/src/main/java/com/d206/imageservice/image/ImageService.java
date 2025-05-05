package com.d206.imageservice.image;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.d206.imageservice.s3.S3Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageService {
	private final S3Service s3Service;

	private final ImageRepository imageRepository;

	public String getPresignedUrl(String fileType) {
		return s3Service.createPresignedPutUrl(UUID.randomUUID().toString(), fileType);
	}
}
