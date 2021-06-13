package com.ninjasparrow.app.repository;

import com.ninjasparrow.app.domain.FormSubmissionElement;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FormSubmissionElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormSubmissionElementRepository extends JpaRepository<FormSubmissionElement, UUID> {}
