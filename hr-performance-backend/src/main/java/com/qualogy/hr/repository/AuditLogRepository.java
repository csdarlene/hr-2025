// AuditLogRepository.java
package com.qualogy.hr.repository;

import com.qualogy.hr.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId, Pageable pageable);
    Page<AuditLog> findByChangedBy(Long userId, Pageable pageable);
    Page<AuditLog> findByChangedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}