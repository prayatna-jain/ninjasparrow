package com.ninjasparrow.app.web.rest;

import com.ninjasparrow.app.domain.ElementType;
import com.ninjasparrow.app.repository.ElementTypeRepository;
import com.ninjasparrow.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.ninjasparrow.app.domain.ElementType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ElementTypeResource {

    private final Logger log = LoggerFactory.getLogger(ElementTypeResource.class);

    private static final String ENTITY_NAME = "elementType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ElementTypeRepository elementTypeRepository;

    public ElementTypeResource(ElementTypeRepository elementTypeRepository) {
        this.elementTypeRepository = elementTypeRepository;
    }

    /**
     * {@code POST  /element-types} : Create a new elementType.
     *
     * @param elementType the elementType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new elementType, or with status {@code 400 (Bad Request)} if the elementType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/element-types")
    public ResponseEntity<ElementType> createElementType(@RequestBody ElementType elementType) throws URISyntaxException {
        log.debug("REST request to save ElementType : {}", elementType);
        if (elementType.getId() != null) {
            throw new BadRequestAlertException("A new elementType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ElementType result = elementTypeRepository.save(elementType);
        return ResponseEntity
            .created(new URI("/api/element-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /element-types/:id} : Updates an existing elementType.
     *
     * @param id the id of the elementType to save.
     * @param elementType the elementType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated elementType,
     * or with status {@code 400 (Bad Request)} if the elementType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the elementType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/element-types/{id}")
    public ResponseEntity<ElementType> updateElementType(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody ElementType elementType
    ) throws URISyntaxException {
        log.debug("REST request to update ElementType : {}, {}", id, elementType);
        if (elementType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, elementType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!elementTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ElementType result = elementTypeRepository.save(elementType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, elementType.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /element-types/:id} : Partial updates given fields of an existing elementType, field will ignore if it is null
     *
     * @param id the id of the elementType to save.
     * @param elementType the elementType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated elementType,
     * or with status {@code 400 (Bad Request)} if the elementType is not valid,
     * or with status {@code 404 (Not Found)} if the elementType is not found,
     * or with status {@code 500 (Internal Server Error)} if the elementType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/element-types/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ElementType> partialUpdateElementType(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody ElementType elementType
    ) throws URISyntaxException {
        log.debug("REST request to partial update ElementType partially : {}, {}", id, elementType);
        if (elementType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, elementType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!elementTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ElementType> result = elementTypeRepository
            .findById(elementType.getId())
            .map(
                existingElementType -> {
                    if (elementType.getName() != null) {
                        existingElementType.setName(elementType.getName());
                    }

                    return existingElementType;
                }
            )
            .map(elementTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, elementType.getId().toString())
        );
    }

    /**
     * {@code GET  /element-types} : get all the elementTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of elementTypes in body.
     */
    @GetMapping("/element-types")
    public List<ElementType> getAllElementTypes() {
        log.debug("REST request to get all ElementTypes");
        return elementTypeRepository.findAll();
    }

    /**
     * {@code GET  /element-types/:id} : get the "id" elementType.
     *
     * @param id the id of the elementType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the elementType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/element-types/{id}")
    public ResponseEntity<ElementType> getElementType(@PathVariable UUID id) {
        log.debug("REST request to get ElementType : {}", id);
        Optional<ElementType> elementType = elementTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(elementType);
    }

    /**
     * {@code DELETE  /element-types/:id} : delete the "id" elementType.
     *
     * @param id the id of the elementType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/element-types/{id}")
    public ResponseEntity<Void> deleteElementType(@PathVariable UUID id) {
        log.debug("REST request to delete ElementType : {}", id);
        elementTypeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
