package com.qualogy.hr.dto.request;

import com.qualogy.hr.model.enums.Department;
import com.qualogy.hr.model.enums.Role;
import com.qualogy.hr.model.enums.SkillLevel;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Set;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @NotNull
    private Department department;

    private SkillLevel skillLevel;
    
    private Long managerId;
    
    @NotEmpty
    private Set<Role> roles;
}
