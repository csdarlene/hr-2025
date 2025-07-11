// UserService.java
package com.qualogy.hr.service;

import com.qualogy.hr.dto.request.SignupRequest;
import com.qualogy.hr.dto.response.UserResponse;
import com.qualogy.hr.exception.ResourceNotFoundException;
import com.qualogy.hr.model.User;
import com.qualogy.hr.model.enums.Department;
import com.qualogy.hr.model.enums.Role;
import com.qualogy.hr.model.enums.SkillLevel;
import com.qualogy.hr.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToDto(user);
    }

    public UserResponse createUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                signUpRequest.getFirstName(),
                signUpRequest.getLastName(),
                signUpRequest.getDepartment(),
                signUpRequest.getSkillLevel()
        );

        Set<Role> roles = signUpRequest.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = Set.of(Role.ROLE_TEAM_MEMBER);
        }
        user.setRoles(roles);

        if (signUpRequest.getManagerId() != null) {
            User manager = userRepository.findById(signUpRequest.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + signUpRequest.getManagerId()));
            user.setManager(manager);
        }

        User savedUser = userRepository.save(user);
        return convertToDto(savedUser);
    }

    public UserResponse updateUser(Long id, SignupRequest userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setDepartment(userDetails.getDepartment());
        user.setSkillLevel(userDetails.getSkillLevel());

        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        if (userDetails.getRoles() != null && !userDetails.getRoles().isEmpty()) {
            user.setRoles(userDetails.getRoles());
        }

        if (userDetails.getManagerId() != null) {
            User manager = userRepository.findById(userDetails.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + userDetails.getManagerId()));
            user.setManager(manager);
        }

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    public List<UserResponse> getUsersByDepartment(Department department) {
        return userRepository.findByDepartment(department).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findByRolesContaining(role).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getTeamMembers(Long managerId) {
        return userRepository.findByManagerId(managerId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private UserResponse convertToDto(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getDepartment(),
                user.getSkillLevel(),
                user.getRoles(),
                user.getManager() != null ? user.getManager().getId() : null,
                user.getManager() != null ? user.getManager().getFullName() : null
        );
    }
}