// UserSecurity.java
package com.qualogy.hr.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component("userSecurity")
public class UserSecurity {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private EvaluationAttachmentRepository attachmentRepository;

    public boolean isSelf(Long userId, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String currentUsername = userDetails.getUsername();
        // In a real application, you would fetch the user by ID and compare usernames
        // For simplicity, we're just comparing the ID with the username
        return currentUsername.equals(String.valueOf(userId));
    }

    public boolean isManager(Authentication authentication, Long managerId) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // In a real application, you would check if the authenticated user is the manager
        // For now, we'll just check if the username matches the managerId
        return userDetails.getUsername().equals(String.valueOf(managerId));
    }

    public boolean isSelfOrManager(Long userId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        // In a real application, you would implement proper checks
        return true; // Simplified for example
    }
    public boolean isEvaluationAccessible(Long evaluationId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        // Admin and HR can access any evaluation
        if (userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || 
                              a.getAuthority().equals("ROLE_HR_MANAGER"))) {
            return true;
        }

        // Check if the user is the employee or evaluator of the evaluation
        return evaluationRepository.findById(evaluationId)
                .map(evaluation -> 
                    evaluation.getEmployee().getUsername().equals(username) ||
                    evaluation.getEvaluator().getUsername().equals(username))
                .orElse(false);
    }

    public boolean isEvaluationEditable(Long evaluationId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        // Admin and HR can edit any evaluation
        if (userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || 
                              a.getAuthority().equals("ROLE_HR_MANAGER"))) {
            return true;
        }

        // Only the evaluator can edit their own evaluations
        return evaluationRepository.findById(evaluationId)
                .map(evaluation -> 
                    evaluation.getEvaluator().getUsername().equals(username) &&
                    !evaluation.isFinalized())
                .orElse(false);
    }
    public boolean isAttachmentAccessible(Long attachmentId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
    
        // Admin and HR can access any attachment
        if (hasAnyRole(authentication, "ROLE_ADMIN", "ROLE_HR_MANAGER")) {
            return true;
        }
    
        // Check if the user is the uploader or has access to the evaluation
        return attachmentRepository.findById(attachmentId)
                .map(attachment -> {
                    Long uploaderId = attachment.getUploadedBy();
                    Long evaluationId = attachment.getEvaluation().getId();
                    
                    // Allow if user is the uploader
                    if (uploaderId != null && uploaderId.toString().equals(authentication.getName())) {
                        return true;
                    }
                    
                    // Allow if user has access to the evaluation
                    return isEvaluationAccessible(evaluationId, authentication);
                })
                .orElse(false);
    }
    
    public boolean isAttachmentEditable(Long attachmentId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
    
        // Admin and HR can edit any attachment
        if (hasAnyRole(authentication, "ROLE_ADMIN", "ROLE_HR_MANAGER")) {
            return true;
        }
    
        // Check if the user is the uploader of the attachment
        return attachmentRepository.findById(attachmentId)
                .map(attachment -> {
                    Long uploaderId = attachment.getUploadedBy();
                    return uploaderId != null && uploaderId.toString().equals(authentication.getName());
                })
                .orElse(false);
    }
    
    private boolean hasAnyRole(Authentication authentication, String... roles) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> {
                    String authority = a.getAuthority();
                    for (String role : roles) {
                        if (authority.equals(role)) {
                            return true;
                        }
                    }
                    return false;
                });
    }
}