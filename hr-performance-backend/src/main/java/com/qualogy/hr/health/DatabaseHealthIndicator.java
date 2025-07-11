// DatabaseHealthIndicator.java
package com.qualogy.hr.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseHealthIndicator(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Health health() {
        try {
            jdbcTemplate.queryForObject("SELECT 1 FROM DUAL", Integer.class);
            return Health.up().withDetail("database", "Oracle Database is up").build();
        } catch (Exception e) {
            return Health.down(e)
                    .withDetail("database", "Oracle Database is down")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}

