package com.qualogy.hr;

import com.qualogy.hr.repository.EvaluationCycleRepository;
import com.qualogy.hr.repository.EvaluationRepository;
import com.qualogy.hr.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

@SpringBootApplication
@EnableCaching
public class HrPerformanceSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(HrPerformanceSystemApplication.class, args);
    }

    @Bean
    @Profile("!test")
    public CommandLineRunner demo(
            UserRepository userRepository,
            EvaluationCycleRepository evaluationCycleRepository,
            EvaluationRepository evaluationRepository) {
        return args -> {
            // This will be executed on application startup
            // You can add more initialization logic here if needed
        };
    }
}

