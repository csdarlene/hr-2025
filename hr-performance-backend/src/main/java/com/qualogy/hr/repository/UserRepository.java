package com.qualogy.hr.repository;

import com.qualogy.hr.model.User;
import com.qualogy.hr.model.enums.Department;
import com.qualogy.hr.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByDepartment(Department department);
    
    List<User> findByRolesContaining(Role role);
    
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = :role AND u.department = :department")
    List<User> findByRoleAndDepartment(@Param("role") Role role, @Param("department") Department department);
    
    @Query("SELECT u FROM User u WHERE u.manager.id = :managerId")
    List<User> findByManagerId(@Param("managerId") Long managerId);
    
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(concat('%', :query, '%')) " +
           "OR LOWER(u.lastName) LIKE LOWER(concat('%', :query, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(concat('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);
}
