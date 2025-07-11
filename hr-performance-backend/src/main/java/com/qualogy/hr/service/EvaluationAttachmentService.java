// EvaluationAttachmentService.java
package com.qualogy.hr.service;

import com.qualogy.hr.dto.request.EvaluationAttachmentRequest;
import com.qualogy.hr.dto.response.EvaluationAttachmentResponse;
import com.qualogy.hr.exception.ResourceNotFoundException;
import com.qualogy.hr.mapper.EvaluationAttachmentMapper;
import com.qualogy.hr.model.Evaluation;
import com.qualogy.hr.model.EvaluationAttachment;
import com.qualogy.hr.repository.EvaluationAttachmentRepository;
import com.qualogy.hr.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluationAttachmentService {

    @Autowired
    private EvaluationAttachmentRepository attachmentRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private EvaluationAttachmentMapper attachmentMapper;

    @Transactional(readOnly = true)
    public List<EvaluationAttachmentResponse> getAttachmentsByEvaluationId(Long evaluationId) {
        return attachmentRepository.findByEvaluationId(evaluationId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EvaluationAttachmentResponse getAttachmentById(Long id) {
        EvaluationAttachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + id));
        return convertToDto(attachment);
    }

    @Transactional
    public EvaluationAttachmentResponse uploadAttachment(EvaluationAttachmentRequest request) throws IOException {
        Evaluation evaluation = evaluationRepository.findById(request.getEvaluationId())
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found with id: " + request.getEvaluationId()));

        // Store the file
        String storedFileName = fileStorageService.storeFile(
                request.getFile(),
                "evaluations/" + evaluation.getId()
        );

        // Get current user ID
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = Long.parseLong(authentication.getName());

        // Save attachment metadata
        EvaluationAttachment attachment = new EvaluationAttachment();
        attachment.setEvaluation(evaluation);
        attachment.setFileName(request.getFile().getOriginalFilename());
        attachment.setFilePath(storedFileName);
        attachment.setFileType(request.getFile().getContentType());
        attachment.setFileSize(request.getFile().getSize());
        attachment.setDescription(request.getDescription());
        attachment.setUploadedBy(currentUserId);

        EvaluationAttachment savedAttachment = attachmentRepository.save(attachment);
        return convertToDto(savedAttachment);
    }

    @Transactional
    public void deleteAttachment(Long id) {
        EvaluationAttachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + id));

        // Delete the file
        fileStorageService.deleteFile(attachment.getFilePath());

        // Delete the database record
        attachmentRepository.delete(attachment);
    }

    public Resource loadFileAsResource(Long attachmentId) {
        EvaluationAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));
        return fileStorageService.loadFileAsResource(attachment.getFilePath());
    }

    private EvaluationAttachmentResponse convertToDto(EvaluationAttachment attachment) {
        EvaluationAttachmentResponse dto = attachmentMapper.toDto(attachment);
        dto.setDownloadUrl("/api/attachments/" + attachment.getId() + "/download");
        return dto;
    }
}