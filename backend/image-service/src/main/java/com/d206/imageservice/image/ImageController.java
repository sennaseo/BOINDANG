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

    @Tag(name = "이미지 업로드")
    @Operation(
            summary = "이미지 업로드 Presigned URL 요청",
            parameters = {
                    @Parameter(name = "fileType", description = "업로드할 파일의 MIME 타입", example = "image/png", required = true),
                    @Parameter(name = "fileName", description = "업로드할 원본 파일 이름", example = "example.png", required = true)
            },
            responses = {
                    @ApiResponse(responseCode = "200", description = "Presigned URL 생성 성공", content = @Content(mediaType = "application/json", schema = @Schema(example = "{  \"data\": {    \"prisignedUrl\": \"string\",    \"fileKey\": \"string\"  },  \"error\": null,  \"success\": true}"))),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터", content = @Content(mediaType = "application/json", schema = @Schema(example = "{  \"data\": null,  \"error\": {    \"status\": \"BAD_REQUEST\",    \"message\": \"string\"  },  \"success\": true}"))),
                    @ApiResponse(responseCode = "500", description = "서버 오류", content = @Content(mediaType = "application/json", schema = @Schema(example = "{  \"data\": null,  \"error\": {    \"status\": \"INTERNAL_SERVER_ERROR\",    \"message\": \"string\"  },  \"success\": true}")))
            }
    )
    @GetMapping("/presigned-url")
    public ResponseEntity<ApiResponses<ImageUploadResDto>> getPresignedUrl(@RequestParam String fileType, @RequestParam String fileName) {
        ImageUploadResDto imageUploadResDto = imageService.getPresignedUrl(fileType, fileName);
        return ResponseEntity.ok(ApiResponses.success(imageUploadResDto));
    }
    @Tag(name = "이미지 업로드")
    @Operation(summary = "이미지 메타데이터 업로드",
            description = "S3에 저장된 이미지의 uuid, 유저 id를 저장합니다",
            responses = {
                    @ApiResponse(responseCode = "200", description = "처리 성공!"),
                    @ApiResponse(responseCode = "500", description = "오류 발생!"),
            })
    @PostMapping("/metadata")
    public ResponseEntity<ApiResponses<Image>> saveMetadata(@RequestHeader("X-User-Id") Long userId, @RequestBody String fileKey) {
        Image image = imageService.saveMetadata(userId, fileKey);
        return ResponseEntity.ok(ApiResponses.success(image));
    }

    @Tag(name = "이미지 조회")
    @Operation(summary = "단일 이미지 조회 (Image ID)",
            responses = {
                    @ApiResponse(responseCode = "200", description = "처리 성공!", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Image.class))),
                    @ApiResponse(responseCode = "404", description = "해당 Image ID의 이미지를 찾을 수 없습니다.", content = @Content(mediaType = "application/json", schema = @Schema(example = "{  \"data\": null,  \"error\": {    \"status\": \"NOT_FOUND\",    \"message\": \"string\"  },  \"success\": true}"))),
                    @ApiResponse(responseCode = "500", description = "오류 발생!", content = @Content(mediaType = "application/json", schema = @Schema(example = "{  \"data\": null,  \"error\": {    \"status\": \"INTERNAL_SERVER_ERROR\",    \"message\": \"string\"  },  \"success\": true}"))),
            })
    @GetMapping("/imageId/{imageId}")
    public ResponseEntity<ApiResponses<Image>> getImageByImageId(@PathVariable Long imageId) {
        Image image = imageService.getImageByImageId(imageId);
        return ResponseEntity.ok(ApiResponses.success(image));
    }
    @Tag(name = "이미지 조회")
    @Operation(summary = "사용자 ID로 이미지 목록 조회",
            responses = {
                    @ApiResponse(responseCode = "200", description = "처리 성공!", content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class, subTypes = {Image.class}))),
                    @ApiResponse(responseCode = "500", description = "오류 발생!", content = @Content(mediaType = "application/json", schema = @Schema(example = "{  \"data\": null,  \"error\": {    \"status\": \"INTERNAL_SERVER_ERROR\",    \"message\": \"string\"  },  \"success\": true}"))),
            })
    @GetMapping("/myImages")
    public ResponseEntity<ApiResponses<List<Image>>> getImageListByUserId(@RequestHeader("X-User-Id") Long userId) {
        List<Image> imageList = imageService.getImageListByUserId(userId);
        return ResponseEntity.ok(ApiResponses.success(imageList));
    }
    @Tag(name = "이미지 조회")
    @Operation(summary = "이미지 ID 목록으로 이미지 목록 조회",
            responses = {
                    @ApiResponse(responseCode = "200", description = "처리 성공!", content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class, subTypes = {Image.class}))),
                    @ApiResponse(responseCode = "500", description = "오류 발생!", content = @Content(mediaType = "application/json", schema = @Schema(example = "{  \"data\": null,  \"error\": {    \"status\": \"INTERNAL_SERVER_ERROR\",    \"message\": \"string\"  },  \"success\": true}"))),
            })
    @PostMapping("/imageList")
    public ResponseEntity<ApiResponses<List<Image>>> getImageListByImageIdList(@RequestBody List<Long> imageIdList) {
        List<Image> imageList = imageService.getImageListByImageIdList(imageIdList);
        return ResponseEntity.ok(ApiResponses.success(imageList));
    }
}
