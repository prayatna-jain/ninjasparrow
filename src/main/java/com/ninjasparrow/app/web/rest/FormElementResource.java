package com.ninjasparrow.app.web.rest;

import com.ninjasparrow.app.domain.FormElement;
import com.ninjasparrow.app.repository.FormElementRepository;
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
 * REST controller for managing {@link com.ninjasparrow.app.domain.FormElement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormElementResource {

    private final Logger log = LoggerFactory.getLogger(FormElementResource.class);

    private static final String ENTITY_NAME = "formElement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormElementRepository formElementRepository;

    public FormElementResource(FormElementRepository formElementRepository) {
        this.formElementRepository = formElementRepository;
    }

    /**
     * {@code POST  /form-elements} : Create a new formElement.
     *
     * @param formElement the formElement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new formElement, or with status {@code 400 (Bad Request)} if the formElement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/form-elements")
    public ResponseEntity<FormElement> createFormElement(@RequestBody FormElement formElement) throws URISyntaxException {
        log.debug("REST request to save FormElement : {}", formElement);
        if (formElement.getId() != null) {
            throw new BadRequestAlertException("A new formElement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FormElement result = formElementRepository.save(formElement);
        return ResponseEntity
            .created(new URI("/api/form-elements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /form-elements/:id} : Updates an existing formElement.
     *
     * @param id the id of the formElement to save.
     * @param formElement the formElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formElement,
     * or with status {@code 400 (Bad Request)} if the formElement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the formElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/form-elements/{id}")
    public ResponseEntity<FormElement> updateFormElement(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody FormElement formElement
    ) throws URISyntaxException {
        log.debug("REST request to update FormElement : {}, {}", id, formElement);
        if (formElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FormElement result = formElementRepository.save(formElement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, formElement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /form-elements/:id} : Partial updates given fields of an existing formElement, field will ignore if it is null
     *
     * @param id the id of the formElement to save.
     * @param formElement the formElement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated formElement,
     * or with status {@code 400 (Bad Request)} if the formElement is not valid,
     * or with status {@code 404 (Not Found)} if the formElement is not found,
     * or with status {@code 500 (Internal Server Error)} if the formElement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/form-elements/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<FormElement> partialUpdateFormElement(
        @PathVariable(value = "id", required = false) final UUID id,
        @RequestBody FormElement formElement
    ) throws URISyntaxException {
        log.debug("REST request to partial update FormElement partially : {}, {}", id, formElement);
        if (formElement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, formElement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formElementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FormElement> result = formElementRepository
            .findById(formElement.getId())
            .map(
                existingFormElement -> {
                    if (formElement.getName() != null) {
                        existingFormElement.setName(formElement.getName());
                    }

                    return existingFormElement;
                }
            )
            .map(formElementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, formElement.getId().toString())
        );
    }

    /**
     * {@code GET  /form-elements} : get all the formElements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of formElements in body.
     */
    @GetMapping("/form-elements")
    public List<FormElement> getAllFormElements() {
        log.debug("REST request to get all FormElements");
        return formElementRepository.findAll();
    }

    /**
     * {@code GET  /form-elements/:id} : get the "id" formElement.
     *
     * @param id the id of the formElement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the formElement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/form-elements/{id}")
    public ResponseEntity<FormElement> getFormElement(@PathVariable UUID id) {
        log.debug("REST request to get FormElement : {}", id);
        Optional<FormElement> formElement = formElementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(formElement);
    }

    /**
     * {@code DELETE  /form-elements/:id} : delete the "id" formElement.
     *
     * @param id the id of the formElement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/form-elements/{id}")
    public ResponseEntity<Void> deleteFormElement(@PathVariable UUID id) {
        log.debug("REST request to delete FormElement : {}", id);
        formElementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
