package com.nutritionservice.common.service;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.EurekaClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EurekaService {
    @Autowired
    private EurekaClient discoveryClient;

    public String getUrl(String service) {
        InstanceInfo instance = discoveryClient.getNextServerFromEureka(service, false);
        return instance.getHomePageUrl();
    }
}