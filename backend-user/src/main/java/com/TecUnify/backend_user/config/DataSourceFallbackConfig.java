package com.TecUnify.backend_user.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Configuration
public class DataSourceFallbackConfig {
    private static final Logger logger = LoggerFactory.getLogger(DataSourceFallbackConfig.class);

    @Value("${spring.datasource.url:}")
    private String pgUrl;

    @Value("${spring.datasource.username:}")
    private String pgUser;

    @Value("${spring.datasource.password:}")
    private String pgPassword;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String pgDriver;

    @Bean
    public DataSource dataSource() {
        // Try PostgreSQL first
        if (pgUrl != null && !pgUrl.isBlank()) {
            try {
                DriverManagerDataSource pg = new DriverManagerDataSource();
                pg.setDriverClassName(pgDriver);
                pg.setUrl(pgUrl);
                pg.setUsername(pgUser);
                pg.setPassword(pgPassword);

                // quick connection test
                try (Connection c = pg.getConnection()) {
                    if (c != null && !c.isClosed()) {
                        logger.info("Connected to PostgreSQL at {}", pgUrl);
                        return pg;
                    }
                }
            } catch (SQLException | RuntimeException e) {
                logger.warn("PostgreSQL not available ({}). Falling back to H2 in-memory.", e.getMessage());
            }
        } else {
            logger.warn("No PostgreSQL URL configured. Falling back to H2 in-memory.");
        }

        // Fallback: H2 in-memory
        DriverManagerDataSource h2 = new DriverManagerDataSource();
        h2.setDriverClassName("org.h2.Driver");
        h2.setUrl("jdbc:h2:mem:tecunify;DB_CLOSE_DELAY=-1;MODE=PostgreSQL");
        h2.setUsername("sa");
        h2.setPassword("");
        logger.info("Using H2 in-memory database for development.");
        return h2;
    }
}
