// AuditAspect.java
package com.qualogy.hr.aspect;

import com.qualogy.hr.service.AuditLogService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
public class AuditAspect {

    @Autowired
    private AuditLogService auditLogService;

    private final ThreadLocal<Map<String, Object>> beforeInvocationState = new ThreadLocal<>();

    @Pointcut("@annotation(com.qualogy.hr.annotation.Auditable)")
    public void auditableMethod() {}

    @Before("auditableMethod()")
    public void beforeAuditableMethod(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        if (args != null && args.length > 0) {
            Map<String, Object> state = new HashMap<>();
            state.put("args", args);
            beforeInvocationState.set(state);
        }
    }

    @AfterReturning(pointcut = "auditableMethod()", returning = "result")
    public void afterAuditableMethod(JoinPoint joinPoint, Object result) {
        try {
            String methodName = joinPoint.getSignature().getName();
            String entityType = extractEntityType(joinPoint.getTarget().getClass().getSimpleName());
            Long entityId = extractEntityId(result);
            
            Map<String, Object> beforeState = beforeInvocationState.get();
            String oldValue = beforeState != null ? beforeState.toString() : null;
            String newValue = result != null ? result.toString() : null;
            
            auditLogService.log(methodName.toUpperCase(), entityType, entityId, oldValue, newValue);
        } finally {
            beforeInvocationState.remove();
        }
    }

    private String extractEntityType(String className) {
        // Convert class name like "UserService" to "USER"
        return className.replaceAll("([a-z])([A-Z])", "$1_$2").toUpperCase()
                .replace("_SERVICE", "")
                .replace("_CONTROLLER", "")
                .replace("_IMPL", "");
    }

    private Long extractEntityId(Object result) {
        // Extract ID from result object if it has an ID field
        try {
            if (result != null) {
                java.lang.reflect.Field idField = result.getClass().getDeclaredField("id");
                idField.setAccessible(true);
                return (Long) idField.get(result);
            }
        } catch (Exception e) {
            // Ignore if ID cannot be extracted
        }
        return null;
    }
}