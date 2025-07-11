// EvaluationAttachmentRepository.java
package com.qualogy.hr.repository;

import com.qualogy.hr.model.Evaluation;
import com.qualogy.hr.model.EvaluationAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluationAttachmentRepository extends JpaRepository<EvaluationAttachment, Long> {
    List<EvaluationAttachment> findByEvaluationId(Long evaluationId);
    void deleteByEvaluationId(Long evaluationId);
}