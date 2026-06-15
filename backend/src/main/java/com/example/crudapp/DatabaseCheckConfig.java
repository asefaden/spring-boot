package com.example.crudapp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import java.sql.Connection;

@Configuration
public class DatabaseCheckConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseCheckConfig.class);

    @Bean
    CommandLineRunner checkDatabaseConnection(DataSource dataSource) {
        return args -> {
            log.info("====================================================");
            log.info("Checking connection to ://aletcloud.com...");
            
            try (Connection connection = dataSource.getConnection()) {
                if (connection != null && !connection.isClosed()) {
                    log.info("🚀 DATABASE CONNECTION ESTABLISHED SUCCESSFULLY!");
                    log.info("Connected to Catalog: " + connection.getCatalog());
                    log.info("Database Driver Name: " + connection.getMetaData().getDriverName());
                } else {
                    log.error("❌ DATABASE CONNECTION FAILED: Connection is null or closed.");
                }
            } catch (Exception e) {
                log.error("❌ DATABASE CONNECTION FAILED: " + e.getMessage());
            }
            
            log.info("====================================================");
        };
    }
}
