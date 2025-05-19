package com.d206.imageservice.image;

import java.time.LocalDateTime;
import java.util.*;

import com.d206.imageservice.dto.ImageUploadResDto;
import com.d206.imageservice.dto.MetaUploadReqDto;
import com.d206.imageservice.exception.*;
import com.netflix.discovery.EurekaClient;
import org.springframework.stereotype.Service;

import com.d206.imageservice.s3.S3Service;

import lombok.RequiredArgsConstructor;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final S3Service s3Service;
    private final ImageRepository imageRepository;

    private final RestClient restClient;
    private EurekaClient discoveryClient;


    public ImageUploadResDto getPresignedUrl(String fileType, String fileName) {
        if (fileType == null || fileType.isEmpty()) {
            throw new MissingFileTypeException("파일 타입이 없습니다");
        }
        if (!fileType.startsWith("image/")) {
            throw new InvalidFileTypeException("이미지 파일만 가능합니다");
        }
        String fileKey = UUID.randomUUID().toString() + fileName.substring(fileName.lastIndexOf("."));
        String presignedUrl = s3Service.createPresignedPutUrl(fileKey, fileType);

        return ImageUploadResDto.builder()
                .presignedUrl(presignedUrl)
                .fileKey(fileKey)
                .build();
    }

    public Image saveMetadata(Long userId, MetaUploadReqDto metaUploadReqDto) {
        String fileKey = metaUploadReqDto.getFileKey();

        if (userId == null) {
            throw new MissingUserIdException("유저 ID가 없습니다");
        }
        if (fileKey == null || fileKey.isEmpty()) {
            throw new MissingUuidException("UUID가 없습니다");
        }

        Image image = Image.builder()
                .imageUrl("https://d1d5plumlg2gxc.cloudfront.net/" + fileKey)
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .build();
        return imageRepository.save(image);
    }

    public Image getImageByImageId(Long imageId) {
        Image image = imageRepository.findById(imageId).orElseThrow(() -> {
            throw new InvalidImageIdException("존재하지 않는 이미지입니다");
        });
        return image;
    }

    public List<Image> getImageListByUserId(Long userId) {
        List<Image> imageList = imageRepository.findAllByUserId(userId);
        return imageList;
    }

    public List<Image> getImageListByImageIdList(List<Long> imageIdList) {
        // 리스트에 담긴 id 중, 잘못된 id가 하나라도 있으면 나머지 이미지도 반환 안함.. 개선 필요
        List<Image> imageList = new ArrayList<>();
        for (Long imageId : imageIdList) {
            imageList.add(getImageByImageId(imageId));
        }
        return imageList;
    }
}
