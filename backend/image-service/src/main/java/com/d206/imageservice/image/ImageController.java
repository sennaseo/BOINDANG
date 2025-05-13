package com.d206.imageservice.image;

import com.d206.imageservice.dto.ImageUploadResDto;
import com.d206.imageservice.dto.MetaUploadReqDto;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.d206.imageservice.common.ApiResponses;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 모든 출처 허용 (개발 단계에서만 사용)
public class ImageController {
    private final ImageService imageService;

    @Tag(name = "Image", description = "이미지 업로드 관련 API")
    @Operation(
            summary = "이미지 업로드 Presigned URL 요청",
            description = "S3에 이미지 파일을 직접 업로드하기 위한 Presigned URL을 요청합니다.<br>" +
                    "클라이언트는 이 URL을 사용하여 S3에 파일을 업로드합니다.<br>" +
                    "지원하는 `fileType`은 'image/jpeg', 'image/png', 'image/gif' 등입니다.",
            parameters = {
                    @Parameter(name = "fileType", description = "업로드할 파일의 MIME 타입", example = "image/png", required = true),
                    @Parameter(name = "fileName", description = "업로드할 원본 파일 이름", example = "example.png", required = true)
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Presigned URL 생성 성공"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터"),
                    @ApiResponse(responseCode = "500", description = "서버 오류")
            }
    )
    @GetMapping("/presigned-url")
    public ResponseEntity<ApiResponses<ImageUploadResDto>> getPresignedUrl(@RequestParam String fileType, @RequestParam String fileName) {
        ImageUploadResDto imageUploadResDto = imageService.getPresignedUrl(fileType, fileName);
        return ResponseEntity.ok(ApiResponses.success(imageUploadResDto));
    }

    @Operation(summary = "이미지 메타데이터 업로드",
            description = "S3에 저장된 이미지의 uuid, 유저 id를 저장합니다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "처리 성공!"),
                    @ApiResponse(responseCode = "500", description = "오류 발생!"),
            })
    @PostMapping("/metadata")
    public ResponseEntity<ApiResponses<Image>> saveMetadata(@RequestBody MetaUploadReqDto metaUploadReqDto) {
        Image image = imageService.saveMetadata(metaUploadReqDto);
        return ResponseEntity.ok(ApiResponses.success(image));
    }

    @Operation(summary = "단일 이미지 정보 조회 (ID)",
            description = "특정 `imageId`에 해당하는 이미지의 상세 정보를 조회합니다.",
            parameters = @Parameter(name = "imageId", description = "조회할 이미지의 고유 ID", required = true, example = "1"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "이미지 정보 조회 성공",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponses.class),
                                    examples = @ExampleObject(name = "성공 응답 예시", value = "{\"status\":\"success\",\"data\":{\"id\":1,\"imageUrl\":\"https://example.com/image-1.jpg\",\"fileKey\":\"path/to/image-1.jpg\",\"originalFileName\":\"image-1.jpg\",\"mimeType\":\"image/jpeg\",\"userId\":100}}")
                            )
                    ),
                    @ApiResponse(responseCode = "404", description = "이미지를 찾을 수 없음",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponses.class),
                                    examples = @ExampleObject(name = "오류 응답 예시", value = "{\"status\":\"error\",\"message\":\"해당 이미지 ID를 찾을 수 없습니다.\"}")
                            )
                    ),
                    @ApiResponse(responseCode = "500", description = "서버 오류",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = ApiResponses.class),
                                    examples = @ExampleObject(name = "서버 오류 응답 예시", value = "{\"status\":\"error\",\"message\":\"이미지 조회 중 오류가 발생했습니다.\"}")
                            )
                    )
            })
    @GetMapping("/imageId/{imageId}")
    public ResponseEntity<ApiResponses<Image>> getImageByImageId(@PathVariable Long imageId) {
        Image image = imageService.getImageByImageId(imageId);
        return ResponseEntity.ok(ApiResponses.success(image));
    }

    @GetMapping("/myImages")
    public ResponseEntity<ApiResponses<List<Image>>> getImageListByUserId(@RequestHeader("X-User-Id") Long userId) {
        List<Image> imageList = imageService.getImageListByUserId(userId);
        return ResponseEntity.ok(ApiResponses.success(imageList));
    }

    @PostMapping("/imageList")
    public ResponseEntity<ApiResponses<List<Image>>> getImageListByImageIdList(@RequestBody List<Long> imageIdList) {
        List<Image> imageList = imageService.getImageListByImageIdList(imageIdList);
        return ResponseEntity.ok(ApiResponses.success(imageList));
    }
}
