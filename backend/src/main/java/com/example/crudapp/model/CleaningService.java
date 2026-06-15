package com.example.crudapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CleaningService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String serviceName; // ለምሳሌ፡ የቤት ጽዳት፣ የቢሮ ጽዳት
    private double price;       // የአገልግሎቱ ዋጋ
    private String duration;    // የሚፈጀው ሰዓት (ለምሳሌ፡ 2 ሰዓት)
    private boolean available;   // አሁን ዝግጁ ነው ወይስ አይደለም?

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
