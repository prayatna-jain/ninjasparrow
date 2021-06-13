package com.ninjasparrow.app.repository;

import com.ninjasparrow.app.domain.FormSubmission;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FormSubmission entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormSubmissionRepository extends JpaRepository<FormSubmission, UUID> {}
