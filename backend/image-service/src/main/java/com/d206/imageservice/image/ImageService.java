package com.d206.imageservice.image;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.d206.imageservice.exception.InvalidFileTypeException;
import com.d206.imageservice.exception.MissingFileTypeException;
import com.d206.imageservice.s3.S3Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageService {
	private final S3Service s3Service;

	private final ImageRepository imageRepository;

	public String getPresignedUrl(String fileType) {
		if (fileType == null || fileType.isEmpty()) {
			throw new MissingFileTypeException("파일 타입이 없습니다.");
		}
		if (!fileType.startsWith("image/")) {
			throw new InvalidFileTypeException("이미지 파일만 가능합니다.");
		}
		return s3Service.createPresignedPutUrl(UUID.randomUUID().toString(), fileType);
	}
}
