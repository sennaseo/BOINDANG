package com.d206.imageservice.s3;

import java.time.Duration;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
@RequiredArgsConstructor
public class S3Service {
	private final S3Client s3Client;
	private final S3Presigner s3Presigner;

	public String createPresignedPutUrl(String keyName, String contentType) {
		String bucketName = System.getenv("S3_BUCKET_NAME");

		// presign request를 위한 정보 생성
		PutObjectRequest objectRequest = PutObjectRequest.builder()
			.bucket(bucketName)
			.key(keyName)
			.contentType(contentType)
			.build();

		// presign request 생성
		PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
			.signatureDuration(Duration.ofMinutes(1))  // 1분동안 사용 가능
			.putObjectRequest(objectRequest)
			.build();

		PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(presignRequest);
		return presignedRequest.url().toExternalForm();
	}
}
