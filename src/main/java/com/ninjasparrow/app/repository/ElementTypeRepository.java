package com.ninjasparrow.app.repository;

import com.ninjasparrow.app.domain.ElementType;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ElementType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ElementTypeRepository extends JpaRepository<ElementType, UUID> {}
