// DiskSpaceHealthIndicator.java
package com.qualogy.hr.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class DiskSpaceHealthIndicator implements HealthIndicator {

    private static final long MIN_DISK_SPACE = 10 * 1024 * 1024; // 10MB

    @Override
    public Health health() {
        File diskPartition = new File("/");
        long freeSpace = diskPartition.getFreeSpace();
        
        if (freeSpace > MIN_DISK_SPACE) {
            return Health.up()
                    .withDetail("total", diskPartition.getTotalSpace())
                    .withDetail("free", freeSpace)
                    .withDetail("threshold", MIN_DISK_SPACE)
                    .build();
        } else {
            return Health.down()
                    .withDetail("error", "Not enough disk space")
                    .withDetail("free", freeSpace)
                    .withDetail("threshold", MIN_DISK_SPACE)
                    .build();
        }
    }
}