// EvaluationAttachmentController.java
package com.qualogy.hr.controller;

import com.qualogy.hr.dto.request.EvaluationAttachmentRequest;
import com.qualogy.hr.dto.response.EvaluationAttachmentResponse;
import com.qualogy.hr.service.EvaluationAttachmentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/attachments")
public class EvaluationAttachmentController {

    @Autowired
    private EvaluationAttachmentService attachmentService;

    @GetMapping("/evaluation/{evaluationId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isEvaluationAccessible(#evaluationId, authentication)")
    public List<EvaluationAttachmentResponse> getEvaluationAttachments(@PathVariable Long evaluationId) {
        return attachmentService.getAttachmentsByEvaluationId(evaluationId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isAttachmentAccessible(#id, authentication)")
    public EvaluationAttachmentResponse getAttachment(@PathVariable Long id) {
        return attachmentService.getAttachmentById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isEvaluationEditable(#request.evaluationId, authentication)")
    public EvaluationAttachmentResponse uploadAttachment(
            @ModelAttribute EvaluationAttachmentRequest request) throws IOException {
        return attachmentService.uploadAttachment(request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isAttachmentEditable(#id, authentication)")
    public ResponseEntity<?> deleteAttachment(@PathVariable Long id) {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/download")
    @ResponseBody
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR_MANAGER') or @userSecurity.isAttachmentAccessible(#id, authentication)")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id, HttpServletRequest request) {
        Resource resource = attachmentService.loadFileAsResource(id);
        
        String contentType = "application/octet-stream";
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Use default content type
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}