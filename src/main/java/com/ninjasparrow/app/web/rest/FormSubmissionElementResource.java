package com.ninjasparrow.app.web.rest;

import com.ninjasparrow.app.domain.FormSubmissionElement;
import com.ninjasparrow.app.repository.FormSubmissionElementRepository;
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
 * REST controller for managing {@link com.ninjasparrow.app.domain.FormSubmissionElement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormSubmissionElementResource {

    private final Logger log = LoggerFactory.getLogger(FormSubmissionElementResource.class);

    private static final String ENTITY_NAME = "formSubmissionElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormSubmissionElementRepository formSubmissionElementRepository;

    public FormSubmissionElementResource(FormSubmissionElementRepository formSubmissionElementRepository) {
        this.formSubmissionElementRepository = formSubmissionElementRepository;
    }

    /**
     * {@code POST  /form-submission-elements} : Create a new formSubmissionElement.
     *
     * @param formSubmissionElement the formSubmissionElement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formSubmissionElement, or with status {@code 400 (Bad Request)} if the formSubmissionElement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/form-submission-elements")
    public ResponseEntity<FormSubmissionElement> createFormSubmissionElement(@RequestBody FormSubmissionElement formSubmissionElement)
        throws URISyntaxException {
        log.debug("REST request to save FormSubmissionElement : {}", formSubmissionElement);
        if (formSubmissionElement.getId() != null) {
            throw new BadRequestAlertException("A new formSubmissionElement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FormSubmissionElement result = formSubmissionElementRepository.save(formSubmissionElement);
        return ResponseEntity
            .created(new URI("/api/form-submission-elements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /form-submission-elements/:id} : Updates an existing formSubmissionElement.
     *
     * @param id the id of the formSubmissionElement to save.
     * @param formSubmissionElement the formSubmissionElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formSubmissionElement,
     * or with status {@code 400 (Bad Request)} if the formSubmissionElement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formSubmissionElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/form-submission-elements/{id}")
    public ResponseEntity<FormSubmissionElement> updateFormSubmissionElement(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody FormSubmissionElement formSubmissionElement
    ) throws URISyntaxException {
        log.debug("REST request to update FormSubmissionElement : {}, {}", id, formSubmissionElement);
        if (formSubmissionElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formSubmissionElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formSubmissionElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FormSubmissionElement result = formSubmissionElementRepository.save(formSubmissionElement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, formSubmissionElement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /form-submission-elements/:id} : Partial updates given fields of an existing formSubmissionElement, field will ignore if it is null
     *
     * @param id the id of the formSubmissionElement to save.
     * @param formSubmissionElement the formSubmissionElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formSubmissionElement,
     * or with status {@code 400 (Bad Request)} if the formSubmissionElement is not valid,
     * or with status {@code 404 (Not Found)} if the formSubmissionElement is not found,
     * or with status {@code 500 (Internal Server Error)} if the formSubmissionElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/form-submission-elements/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<FormSubmissionElement> partialUpdateFormSubmissionElement(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody FormSubmissionElement formSubmissionElement
    ) throws URISyntaxException {
        log.debug("REST request to partial update FormSubmissionElement partially : {}, {}", id, formSubmissionElement);
        if (formSubmissionElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formSubmissionElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formSubmissionElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormSubmissionElement> result = formSubmissionElementRepository
            .findById(formSubmissionElement.getId())
            .map(
                existingFormSubmissionElement -> {
                    if (formSubmissionElement.getValue() != null) {
                        existingFormSubmissionElement.setValue(formSubmissionElement.getValue());
                    }

                    return existingFormSubmissionElement;
                }
            )
            .map(formSubmissionElementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, formSubmissionElement.getId().toString())
        );
    }

    /**
     * {@code GET  /form-submission-elements} : get all the formSubmissionElements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formSubmissionElements in body.
     */
    @GetMapping("/form-submission-elements")
    public List<FormSubmissionElement> getAllFormSubmissionElements() {
        log.debug("REST request to get all FormSubmissionElements");
        return formSubmissionElementRepository.findAll();
    }

    /**
     * {@code GET  /form-submission-elements/:id} : get the "id" formSubmissionElement.
     *
     * @param id the id of the formSubmissionElement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formSubmissionElement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/form-submission-elements/{id}")
    public ResponseEntity<FormSubmissionElement> getFormSubmissionElement(@PathVariable UUID id) {
        log.debug("REST request to get FormSubmissionElement : {}", id);
        Optional<FormSubmissionElement> formSubmissionElement = formSubmissionElementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formSubmissionElement);
    }

    /**
     * {@code DELETE  /form-submission-elements/:id} : delete the "id" formSubmissionElement.
     *
     * @param id the id of the formSubmissionElement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/form-submission-elements/{id}")
    public ResponseEntity<Void> deleteFormSubmissionElement(@PathVariable UUID id) {
        log.debug("REST request to delete FormSubmissionElement : {}", id);
        formSubmissionElementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
