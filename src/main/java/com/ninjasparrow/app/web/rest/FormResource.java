package com.ninjasparrow.app.web.rest;

import com.ninjasparrow.app.domain.Form;
import com.ninjasparrow.app.repository.FormRepository;
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
 * REST controller for managing {@link com.ninjasparrow.app.domain.Form}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FormResource {

    private final Logger log = LoggerFactory.getLogger(FormResource.class);

    private static final String ENTITY_NAME = "form";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FormRepository formRepository;

    public FormResource(FormRepository formRepository) {
        this.formRepository = formRepository;
    }

    /**
     * {@code POST  /forms} : Create a new form.
     *
     * @param form the form to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new form, or with status {@code 400 (Bad Request)} if the form has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/forms")
    public ResponseEntity<Form> createForm(@RequestBody Form form) throws URISyntaxException {
        log.debug("REST request to save Form : {}", form);
        if (form.getId() != null) {
            throw new BadRequestAlertException("A new form cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Form result = formRepository.save(form);
        return ResponseEntity
            .created(new URI("/api/forms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /forms/:id} : Updates an existing form.
     *
     * @param id the id of the form to save.
     * @param form the form to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated form,
     * or with status {@code 400 (Bad Request)} if the form is not valid,
     * or with status {@code 500 (Internal Server Error)} if the form couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/forms/{id}")
    public ResponseEntity<Form> updateForm(@PathVariable(value = "id", required = false) final UUID id, @RequestBody Form form)
        throws URISyntaxException {
        log.debug("REST request to update Form : {}, {}", id, form);
        if (form.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, form.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Form result = formRepository.save(form);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, form.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /forms/:id} : Partial updates given fields of an existing form, field will ignore if it is null
     *
     * @param id the id of the form to save.
     * @param form the form to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated form,
     * or with status {@code 400 (Bad Request)} if the form is not valid,
     * or with status {@code 404 (Not Found)} if the form is not found,
     * or with status {@code 500 (Internal Server Error)} if the form couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/forms/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Form> partialUpdateForm(@PathVariable(value = "id", required = false) final UUID id, @RequestBody Form form)
        throws URISyntaxException {
        log.debug("REST request to partial update Form partially : {}, {}", id, form);
        if (form.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, form.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!formRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Form> result = formRepository
            .findById(form.getId())
            .map(
                existingForm -> {
                    if (form.getName() != null) {
                        existingForm.setName(form.getName());
                    }

                    return existingForm;
                }
            )
            .map(formRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, form.getId().toString())
        );
    }

    /**
     * {@code GET  /forms} : get all the forms.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of forms in body.
     */
    @GetMapping("/forms")
    public List<Form> getAllForms() {
        log.debug("REST request to get all Forms");
        return formRepository.findAll();
    }

    /**
     * {@code GET  /forms/:id} : get the "id" form.
     *
     * @param id the id of the form to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the form, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/forms/{id}")
    public ResponseEntity<Form> getForm(@PathVariable UUID id) {
        log.debug("REST request to get Form : {}", id);
        Optional<Form> form = formRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(form);
    }

    /**
     * {@code DELETE  /forms/:id} : delete the "id" form.
     *
     * @param id the id of the form to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/forms/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable UUID id) {
        log.debug("REST request to delete Form : {}", id);
        formRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
