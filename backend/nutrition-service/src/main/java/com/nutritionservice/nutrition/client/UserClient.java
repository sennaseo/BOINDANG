package com.nutritionservice.nutrition.client;

import com.nutritionservice.nutrition.model.dto.external.UserInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
//
//@FeignClient(name = "user-service", url = "${user-service.url}")
//public interface UserClient {
//
//    @GetMapping("/user/me")
//    UserInfo getUserInfo(@RequestHeader("X-User-Id") String userId);
//}
