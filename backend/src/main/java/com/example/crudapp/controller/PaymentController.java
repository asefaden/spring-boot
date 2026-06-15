package com.example.crudapp.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    // ከChapa Dashboard የምታገኘው የሙከራ ሰክሬት ቁልፍ (Test Secret Key)
    private final String CHAPA_AUTH_KEY = "Bearer CHASECK_TEST-xxxxxxxxxxxxxxxxxxxxxxxx";

    @PostMapping("/initialize")
    public ResponseEntity<?> initializePayment(@RequestBody Map<String, Object> paymentRequest) {
        String txRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8);
        RestTemplate restTemplate = new RestTemplate();

        // ለChapa API የሚላክ መረጃ
        Map<String, Object> body = new HashMap<>();
        body.put("amount", paymentRequest.get("price"));
        body.put("currency", "ETB");
        body.put("email", "customer@example.com");
        body.put("first_name", "Alet");
        body.put("last_name", "Cloud");
        body.put("tx_ref", txRef);
        body.put("callback_url", "https://webhook.site");
        // body.put("return_url", "http://localhost:3000/?status=success");
        body.put("return url", "https://spring.app.aletcloud.com/?status=success");
        body.put("customization", Map.of("title", paymentRequest.get("serviceName")));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", CHAPA_AUTH_KEY);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://chapa.co",
                    entity,
                    Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "የክፍያ መነሻ መፍጠር አልተቻለም: " + e.getMessage()));
        }
    }
}
