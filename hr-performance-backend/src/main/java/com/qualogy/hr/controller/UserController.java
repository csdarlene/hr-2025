// UserController.java
package com.qualogy.hr.controller;

import com.qualogy.hr.dto.request.SignupRequest;
import com.qualogy.hr.dto.response.UserResponse;
import com.qualogy.hr.model.enums.Department;
import com.qualogy.hr.model.enums.Role;
import com.qualogy.hr.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isSelfOrManager(#id, authentication)")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public UserResponse createUser(@RequestBody SignupRequest signUpRequest) {
        return userService.createUser(signUpRequest);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isSelf(#id, authentication)")
    public UserResponse updateUser(@PathVariable Long id, @RequestBody SignupRequest userDetails) {
        return userService.updateUser(id, userDetails);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/department/{department}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public List<UserResponse> getUsersByDepartment(@PathVariable Department department) {
        return userService.getUsersByDepartment(department);
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER')")
    public List<UserResponse> getUsersByRole(@PathVariable Role role) {
        return userService.getUsersByRole(role);
    }

    @GetMapping("/manager/{managerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isManager(authentication, #managerId)")
    public List<UserResponse> getTeamMembers(@PathVariable Long managerId) {
        return userService.getTeamMembers(managerId);
    }
}