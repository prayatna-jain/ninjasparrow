package com.ninjasparrow.app.web.rest;

import com.ninjasparrow.app.domain.FormSubmission;
import com.ninjasparrow.app.repository.FormSubmissionRepository;
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
 * REST controller for managing {@link com.ninjasparrow.app.domain.FormSubmission}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormSubmissionResource {

    private final Logger log = LoggerFactory.getLogger(FormSubmissionResource.class);

    private static final String ENTITY_NAME = "formSubmission";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormSubmissionRepository formSubmissionRepository;

    public FormSubmissionResource(FormSubmissionRepository formSubmissionRepository) {
        this.formSubmissionRepository = formSubmissionRepository;
    }

    /**
     * {@code POST  /form-submissions} : Create a new formSubmission.
     *
     * @param formSubmission the formSubmission to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formSubmission, or with status {@code 400 (Bad Request)} if the formSubmission has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/form-submissions")
    public ResponseEntity<FormSubmission> createFormSubmission(@RequestBody FormSubmission formSubmission) throws URISyntaxException {
        log.debug("REST request to save FormSubmission : {}", formSubmission);
        if (formSubmission.getId() != null) {
            throw new BadRequestAlertException("A new formSubmission cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FormSubmission result = formSubmissionRepository.save(formSubmission);
        return ResponseEntity
            .created(new URI("/api/form-submissions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /form-submissions/:id} : Updates an existing formSubmission.
     *
     * @param id the id of the formSubmission to save.
     * @param formSubmission the formSubmission to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formSubmission,
     * or with status {@code 400 (Bad Request)} if the formSubmission is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formSubmission couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/form-submissions/{id}")
    public ResponseEntity<FormSubmission> updateFormSubmission(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody FormSubmission formSubmission
    ) throws URISyntaxException {
        log.debug("REST request to update FormSubmission : {}, {}", id, formSubmission);
        if (formSubmission.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formSubmission.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formSubmissionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FormSubmission result = formSubmissionRepository.save(formSubmission);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, formSubmission.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /form-submissions/:id} : Partial updates given fields of an existing formSubmission, field will ignore if it is null
     *
     * @param id the id of the formSubmission to save.
     * @param formSubmission the formSubmission to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formSubmission,
     * or with status {@code 400 (Bad Request)} if the formSubmission is not valid,
     * or with status {@code 404 (Not Found)} if the formSubmission is not found,
     * or with status {@code 500 (Internal Server Error)} if the formSubmission couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/form-submissions/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<FormSubmission> partialUpdateFormSubmission(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody FormSubmission formSubmission
    ) throws URISyntaxException {
        log.debug("REST request to partial update FormSubmission partially : {}, {}", id, formSubmission);
        if (formSubmission.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formSubmission.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formSubmissionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormSubmission> result = formSubmissionRepository
            .findById(formSubmission.getId())
            .map(
                existingFormSubmission -> {
                    return existingFormSubmission;
                }
            )
            .map(formSubmissionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, formSubmission.getId().toString())
        );
    }

    /**
     * {@code GET  /form-submissions} : get all the formSubmissions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formSubmissions in body.
     */
    @GetMapping("/form-submissions")
    public List<FormSubmission> getAllFormSubmissions() {
        log.debug("REST request to get all FormSubmissions");
        return formSubmissionRepository.findAll();
    }

    /**
     * {@code GET  /form-submissions/:id} : get the "id" formSubmission.
     *
     * @param id the id of the formSubmission to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formSubmission, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/form-submissions/{id}")
    public ResponseEntity<FormSubmission> getFormSubmission(@PathVariable UUID id) {
        log.debug("REST request to get FormSubmission : {}", id);
        Optional<FormSubmission> formSubmission = formSubmissionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formSubmission);
    }

    /**
     * {@code DELETE  /form-submissions/:id} : delete the "id" formSubmission.
     *
     * @param id the id of the formSubmission to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/form-submissions/{id}")
    public ResponseEntity<Void> deleteFormSubmission(@PathVariable UUID id) {
        log.debug("REST request to delete FormSubmission : {}", id);
        formSubmissionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
