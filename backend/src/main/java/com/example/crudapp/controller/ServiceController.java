package com.example.crudapp.controller;

import com.example.crudapp.model.CleaningService;
import com.example.crudapp.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public @NonNull List<CleaningService> getAllServices() {
        return serviceRepository.findAll();
    }

    @PostMapping
    public @NonNull CleaningService createService(@RequestBody @NonNull CleaningService service) {
        return serviceRepository.save(service);
    }

    // === አስተዳዳሪው እንዲያስተካክል (Edit) ===
    @PutMapping("/{id}")
    public @NonNull CleaningService updateService(@PathVariable long id,
            @RequestBody @NonNull CleaningService details) {
        CleaningService service = serviceRepository.findById(id).orElseThrow();
        service.setServiceName(details.getServiceName());
        service.setPrice(details.getPrice());
        service.setDuration(details.getDuration());
        service.setAvailable(details.isAvailable());
        return serviceRepository.save(service);
    }

    // === አስተዳዳሪው እንዲያጠፋ (Delete) ===
    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable long id) {
        serviceRepository.deleteById(id);
    }
}
