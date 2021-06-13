package com.ninjasparrow.app.web.rest;

import com.ninjasparrow.app.domain.LookupField;
import com.ninjasparrow.app.repository.LookupFieldRepository;
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
 * REST controller for managing {@link com.ninjasparrow.app.domain.LookupField}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LookupFieldResource {

    private final Logger log = LoggerFactory.getLogger(LookupFieldResource.class);

    private static final String ENTITY_NAME = "lookupField";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LookupFieldRepository lookupFieldRepository;

    public LookupFieldResource(LookupFieldRepository lookupFieldRepository) {
        this.lookupFieldRepository = lookupFieldRepository;
    }

    /**
     * {@code POST  /lookup-fields} : Create a new lookupField.
     *
     * @param lookupField the lookupField to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lookupField, or with status {@code 400 (Bad Request)} if the lookupField has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lookup-fields")
    public ResponseEntity<LookupField> createLookupField(@RequestBody LookupField lookupField) throws URISyntaxException {
        log.debug("REST request to save LookupField : {}", lookupField);
        if (lookupField.getId() != null) {
            throw new BadRequestAlertException("A new lookupField cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LookupField result = lookupFieldRepository.save(lookupField);
        return ResponseEntity
            .created(new URI("/api/lookup-fields/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lookup-fields/:id} : Updates an existing lookupField.
     *
     * @param id the id of the lookupField to save.
     * @param lookupField the lookupField to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lookupField,
     * or with status {@code 400 (Bad Request)} if the lookupField is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lookupField couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lookup-fields/{id}")
    public ResponseEntity<LookupField> updateLookupField(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody LookupField lookupField
    ) throws URISyntaxException {
        log.debug("REST request to update LookupField : {}, {}", id, lookupField);
        if (lookupField.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lookupField.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lookupFieldRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LookupField result = lookupFieldRepository.save(lookupField);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, lookupField.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lookup-fields/:id} : Partial updates given fields of an existing lookupField, field will ignore if it is null
     *
     * @param id the id of the lookupField to save.
     * @param lookupField the lookupField to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lookupField,
     * or with status {@code 400 (Bad Request)} if the lookupField is not valid,
     * or with status {@code 404 (Not Found)} if the lookupField is not found,
     * or with status {@code 500 (Internal Server Error)} if the lookupField couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lookup-fields/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<LookupField> partialUpdateLookupField(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody LookupField lookupField
    ) throws URISyntaxException {
        log.debug("REST request to partial update LookupField partially : {}, {}", id, lookupField);
        if (lookupField.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lookupField.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lookupFieldRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LookupField> result = lookupFieldRepository
            .findById(lookupField.getId())
            .map(
                existingLookupField -> {
                    if (lookupField.getFormId() != null) {
                        existingLookupField.setFormId(lookupField.getFormId());
                    }
                    if (lookupField.getElementId() != null) {
                        existingLookupField.setElementId(lookupField.getElementId());
                    }

                    return existingLookupField;
                }
            )
            .map(lookupFieldRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, lookupField.getId().toString())
        );
    }

    /**
     * {@code GET  /lookup-fields} : get all the lookupFields.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lookupFields in body.
     */
    @GetMapping("/lookup-fields")
    public List<LookupField> getAllLookupFields() {
        log.debug("REST request to get all LookupFields");
        return lookupFieldRepository.findAll();
    }

    /**
     * {@code GET  /lookup-fields/:id} : get the "id" lookupField.
     *
     * @param id the id of the lookupField to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lookupField, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lookup-fields/{id}")
    public ResponseEntity<LookupField> getLookupField(@PathVariable UUID id) {
        log.debug("REST request to get LookupField : {}", id);
        Optional<LookupField> lookupField = lookupFieldRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(lookupField);
    }

    /**
     * {@code DELETE  /lookup-fields/:id} : delete the "id" lookupField.
     *
     * @param id the id of the lookupField to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lookup-fields/{id}")
    public ResponseEntity<Void> deleteLookupField(@PathVariable UUID id) {
        log.debug("REST request to delete LookupField : {}", id);
        lookupFieldRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
