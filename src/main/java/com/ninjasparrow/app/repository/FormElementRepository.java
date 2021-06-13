package com.ninjasparrow.app.repository;

import com.ninjasparrow.app.domain.FormElement;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FormElement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FormElementRepository extends JpaRepository<FormElement, UUID> {}
