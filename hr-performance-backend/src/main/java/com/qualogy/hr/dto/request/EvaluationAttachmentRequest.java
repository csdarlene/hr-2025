// EvaluationAttachmentRequest.java
package com.qualogy.hr.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EvaluationAttachmentRequest {
    @NotNull
    private Long evaluationId;
    private String description;
    @NotNull
    private MultipartFile file;
}

// EvaluationAttachmentResponse.java
package com.qualogy.hr.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationAttachmentResponse {
    private Long id;
    private Long evaluationId;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String description;
    private String downloadUrl;
    private LocalDateTime uploadedAt;
    private Long uploadedBy;
}