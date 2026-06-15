package com.example.crudapp;

import com.example.crudapp.model.CleaningService;
import com.example.crudapp.repository.ServiceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ServiceRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                CleaningService home = new CleaningService();
                home.setServiceName("መደበኛ የቤት ጽዳት (Home Cleaning)");
                home.setPrice(1500.0);
                home.setDuration("3 ሰዓት");
                home.setAvailable(true);

                CleaningService office = new CleaningService();
                office.setServiceName("የቢሮ ሙሉ ጽዳት (Office Cleaning)");
                office.setPrice(4500.0);
                office.setDuration("5 ሰዓት");
                office.setAvailable(true);

                CleaningService carpet = new CleaningService();
                carpet.setServiceName("የምንጣፍ እና ሶፋ እጥበት (Carpet Wash)");
                carpet.setPrice(2500.0);
                carpet.setDuration("2 ሰዓት");
                carpet.setAvailable(true);

                repository.save(home);
                repository.save(office);
                repository.save(carpet);
                
                System.out.println("🌱 የጽዳት አገልግሎቶች መረጃ በራስ-ሰር ዳታቤዝ ውስጥ ተሞልቷል!");
            }
        };
    }
}
