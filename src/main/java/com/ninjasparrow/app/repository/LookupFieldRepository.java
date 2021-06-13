package com.ninjasparrow.app.repository;

import com.ninjasparrow.app.domain.LookupField;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LookupField entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LookupFieldRepository extends JpaRepository<LookupField, UUID> {}
