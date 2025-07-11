// DataInitializer.java
package com.qualogy.hr.config;

import com.qualogy.hr.model.User;
import com.qualogy.hr.model.enums.Department;
import com.qualogy.hr.model.enums.Role;
import com.qualogy.hr.model.enums.SkillLevel;
import com.qualogy.hr.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@Profile("!test")
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // Only initialize if no users exist
        if (userRepository.count() == 0) {
            // Create admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@qualogy.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setDepartment(Department.PEOPLE_AND_CULTURE);
            admin.setSkillLevel(SkillLevel.SENIOR);
            admin.setRoles(Set.of(Role.ROLE_ADMIN));
            admin.setActive(true);
            userRepository.save(admin);

            // Create HR manager
            User hrManager = new User();
            hrManager.setUsername("hr.manager");
            hrManager.setEmail("hr@qualogy.com");
            hrManager.setPassword(passwordEncoder.encode("hr123"));
            hrManager.setFirstName("HR");
            hrManager.setLastName("Manager");
            hrManager.setDepartment(Department.PEOPLE_AND_CULTURE);
            hrManager.setSkillLevel(SkillLevel.SENIOR);
            hrManager.setRoles(Set.of(Role.ROLE_HR_MANAGER));
            hrManager.setActive(true);
            userRepository.save(hrManager);
        }
    }
}