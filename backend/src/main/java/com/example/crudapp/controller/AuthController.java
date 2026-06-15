package com.example.crudapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // እዚህ ላይ የአንተን የገዛ የራስህን Admin ስም እና ፓስወርድ መወሰን ትችላለህ
        if ("admin".equals(username) && "alet1234".equals(password)) {
            return ResponseEntity.ok(Map.of("success", true, "token", "fake-admin-jwt-token"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል!"));
        }
    }
}
