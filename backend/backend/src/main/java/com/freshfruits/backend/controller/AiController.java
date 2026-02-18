package com.freshfruits.backend.controller;


import com.freshfruits.backend.security.AiAssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiAssistantService aiService;

    // POST /api/chat
    // Body: { "message": "Where is my order #101?" }
    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String response = aiService.chat(userMessage);
        return Map.of("response", response);
    }
}
