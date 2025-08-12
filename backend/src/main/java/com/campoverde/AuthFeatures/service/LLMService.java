package com.campoverde.AuthFeatures.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;
import java.util.*;

@Service
public class LLMService {

    private final String LLM_URL = "http://localhost:11434/api/generate";
    private final String model = "gemma3:latest";

    private final String buildPrompt(String poseDataJson) {
        return """
                You are a professional soccer coach.
                The player just took a penalty kick.
                
                INPUT (pose JSON data from video):
                %s
                
                TASK:
                -Give ONE short, actionable coaching tip (max 1-2 sentences).
                -DO NOT repeat raw numbers or data: tip must only be about advice.
                -Focus only on improving PENALTY KICKS so the ball can go into the net.
                -Base advice solely on pose data issues from the video.
                -Only If the video is NOT soccer-related (such as no soccer ball, no kicking, anything NOT related to soccer at all), respond like this: "No soccer action detected."
                -Add 1-2 relevant emojis;
                """.formatted(poseDataJson == null ? "null" : poseDataJson);
    }

    public String generateFeedback(String poseDataJson) {
        String prompt = buildPrompt(poseDataJson);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        RestTemplate restTemplate = new RestTemplate();
        Map response = restTemplate.exchange(
                LLM_URL,
                HttpMethod.POST,
                entity,
                Map.class
        ).getBody();

        if(response != null && response.containsKey("response")) {
            return response.get("response").toString().trim();
        }
        else {
            return "Feedback unavailable.";
        }
    }
}
