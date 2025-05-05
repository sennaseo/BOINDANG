package com.d206.imageservice.image;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.d206.imageservice.common.ApiResponses;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/image")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 모든 출처 허용 (개발 단계에서만 사용)
public class ImageController {
	private final ImageService imageService;

	@Operation(summary = "이미지 업로드 Presigned URL 요청",
		description = "S3에 이미지 파일을 업로드하기 위한 Presigned URL을 요청합니다")
	@GetMapping("/presigned-url")
	public ResponseEntity<ApiResponses<String>> getPresignedUrl(@RequestParam String fileType) {
		String presignedUrl = imageService.getPresignedUrl(fileType);
		return ResponseEntity.ok(ApiResponses.success(presignedUrl));
	}

	// @Operation(summary = "이미지 메타데이터 업로드",
	// 	description = "이미지의 메타데이터를 저장합니다",
	// 	responses = {
	// 		@ApiResponse(responseCode = "200", description = "처리 성공!"),
	// 		@ApiResponse(responseCode = "500", description = "오류 발생!"),
	// 	})
	// @PostMapping("/metadata")
	// public ResponseEntity<ApiResponses<Image>> saveMetadata(@RequestBody ImageSaveDto imageSaveDto) {
	// 	try {
	// 		Image image = imageService.saveMetadata(imageSaveDto);
	// 		System.out.println(imageSaveDto);
	// 		return ResponseEntity.ok(ApiResponses.success(image));
	// 	} catch (CustomException e) {
	// 		ErrorResponse errorResponse = new ErrorResponse(e.getErrorCode().getCode(), e.getErrorCode().getMessage());
	// 		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	// 			.body(ApiResponses.error(errorResponse));
	// 	}
	// }
}
