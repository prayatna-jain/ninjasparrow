package com.ninjasparrow.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ninjasparrow.app.IntegrationTest;
import com.ninjasparrow.app.domain.FormSubmissionElement;
import com.ninjasparrow.app.repository.FormSubmissionElementRepository;
import java.util.List;
import java.util.UUID;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FormSubmissionElementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormSubmissionElementResourceIT {

    private static final UUID DEFAULT_FORM_SUBMISSION_ID = UUID.randomUUID();
    private static final UUID UPDATED_FORM_SUBMISSION_ID = UUID.randomUUID();

    private static final UUID DEFAULT_ELEMENT_ID = UUID.randomUUID();
    private static final UUID UPDATED_ELEMENT_ID = UUID.randomUUID();

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/form-submission-elements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private FormSubmissionElementRepository formSubmissionElementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormSubmissionElementMockMvc;

    private FormSubmissionElement formSubmissionElement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormSubmissionElement createEntity(EntityManager em) {
        FormSubmissionElement formSubmissionElement = new FormSubmissionElement()
            .formSubmissionId(DEFAULT_FORM_SUBMISSION_ID)
            .elementId(DEFAULT_ELEMENT_ID)
            .value(DEFAULT_VALUE);
        return formSubmissionElement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormSubmissionElement createUpdatedEntity(EntityManager em) {
        FormSubmissionElement formSubmissionElement = new FormSubmissionElement()
            .formSubmissionId(UPDATED_FORM_SUBMISSION_ID)
            .elementId(UPDATED_ELEMENT_ID)
            .value(UPDATED_VALUE);
        return formSubmissionElement;
    }

    @BeforeEach
    public void initTest() {
        formSubmissionElement = createEntity(em);
    }

    @Test
    @Transactional
    void createFormSubmissionElement() throws Exception {
        int databaseSizeBeforeCreate = formSubmissionElementRepository.findAll().size();
        // Create the FormSubmissionElement
        restFormSubmissionElementMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formSubmissionElement))
            )
            .andExpect(status().isCreated());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeCreate + 1);
        FormSubmissionElement testFormSubmissionElement = formSubmissionElementList.get(formSubmissionElementList.size() - 1);
        assertThat(testFormSubmissionElement.getFormSubmissionId()).isEqualTo(DEFAULT_FORM_SUBMISSION_ID);
        assertThat(testFormSubmissionElement.getElementId()).isEqualTo(DEFAULT_ELEMENT_ID);
        assertThat(testFormSubmissionElement.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createFormSubmissionElementWithExistingId() throws Exception {
        // Create the FormSubmissionElement with an existing ID
        formSubmissionElementRepository.saveAndFlush(formSubmissionElement);

        int databaseSizeBeforeCreate = formSubmissionElementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormSubmissionElementMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formSubmissionElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFormSubmissionElements() throws Exception {
        // Initialize the database
        formSubmissionElementRepository.saveAndFlush(formSubmissionElement);

        // Get all the formSubmissionElementList
        restFormSubmissionElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formSubmissionElement.getId().toString())))
            .andExpect(jsonPath("$.[*].formSubmissionId").value(hasItem(DEFAULT_FORM_SUBMISSION_ID.toString())))
            .andExpect(jsonPath("$.[*].elementId").value(hasItem(DEFAULT_ELEMENT_ID.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    void getFormSubmissionElement() throws Exception {
        // Initialize the database
        formSubmissionElementRepository.saveAndFlush(formSubmissionElement);

        // Get the formSubmissionElement
        restFormSubmissionElementMockMvc
            .perform(get(ENTITY_API_URL_ID, formSubmissionElement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formSubmissionElement.getId().toString()))
            .andExpect(jsonPath("$.formSubmissionId").value(DEFAULT_FORM_SUBMISSION_ID.toString()))
            .andExpect(jsonPath("$.elementId").value(DEFAULT_ELEMENT_ID.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingFormSubmissionElement() throws Exception {
        // Get the formSubmissionElement
        restFormSubmissionElementMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFormSubmissionElement() throws Exception {
        // Initialize the database
        formSubmissionElementRepository.saveAndFlush(formSubmissionElement);

        int databaseSizeBeforeUpdate = formSubmissionElementRepository.findAll().size();

        // Update the formSubmissionElement
        FormSubmissionElement updatedFormSubmissionElement = formSubmissionElementRepository.findById(formSubmissionElement.getId()).get();
        // Disconnect from session so that the updates on updatedFormSubmissionElement are not directly saved in db
        em.detach(updatedFormSubmissionElement);
        updatedFormSubmissionElement.formSubmissionId(UPDATED_FORM_SUBMISSION_ID).elementId(UPDATED_ELEMENT_ID).value(UPDATED_VALUE);

        restFormSubmissionElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormSubmissionElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormSubmissionElement))
            )
            .andExpect(status().isOk());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeUpdate);
        FormSubmissionElement testFormSubmissionElement = formSubmissionElementList.get(formSubmissionElementList.size() - 1);
        assertThat(testFormSubmissionElement.getFormSubmissionId()).isEqualTo(UPDATED_FORM_SUBMISSION_ID);
        assertThat(testFormSubmissionElement.getElementId()).isEqualTo(UPDATED_ELEMENT_ID);
        assertThat(testFormSubmissionElement.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingFormSubmissionElement() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionElementRepository.findAll().size();
        formSubmissionElement.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormSubmissionElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formSubmissionElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formSubmissionElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormSubmissionElement() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionElementRepository.findAll().size();
        formSubmissionElement.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormSubmissionElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formSubmissionElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormSubmissionElement() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionElementRepository.findAll().size();
        formSubmissionElement.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormSubmissionElementMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formSubmissionElement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormSubmissionElementWithPatch() throws Exception {
        // Initialize the database
        formSubmissionElementRepository.saveAndFlush(formSubmissionElement);

        int databaseSizeBeforeUpdate = formSubmissionElementRepository.findAll().size();

        // Update the formSubmissionElement using partial update
        FormSubmissionElement partialUpdatedFormSubmissionElement = new FormSubmissionElement();
        partialUpdatedFormSubmissionElement.setId(formSubmissionElement.getId());

        partialUpdatedFormSubmissionElement.value(UPDATED_VALUE);

        restFormSubmissionElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormSubmissionElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormSubmissionElement))
            )
            .andExpect(status().isOk());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeUpdate);
        FormSubmissionElement testFormSubmissionElement = formSubmissionElementList.get(formSubmissionElementList.size() - 1);
        assertThat(testFormSubmissionElement.getFormSubmissionId()).isEqualTo(DEFAULT_FORM_SUBMISSION_ID);
        assertThat(testFormSubmissionElement.getElementId()).isEqualTo(DEFAULT_ELEMENT_ID);
        assertThat(testFormSubmissionElement.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateFormSubmissionElementWithPatch() throws Exception {
        // Initialize the database
        formSubmissionElementRepository.saveAndFlush(formSubmissionElement);

        int databaseSizeBeforeUpdate = formSubmissionElementRepository.findAll().size();

        // Update the formSubmissionElement using partial update
        FormSubmissionElement partialUpdatedFormSubmissionElement = new FormSubmissionElement();
        partialUpdatedFormSubmissionElement.setId(formSubmissionElement.getId());

        partialUpdatedFormSubmissionElement.formSubmissionId(UPDATED_FORM_SUBMISSION_ID).elementId(UPDATED_ELEMENT_ID).value(UPDATED_VALUE);

        restFormSubmissionElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormSubmissionElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormSubmissionElement))
            )
            .andExpect(status().isOk());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeUpdate);
        FormSubmissionElement testFormSubmissionElement = formSubmissionElementList.get(formSubmissionElementList.size() - 1);
        assertThat(testFormSubmissionElement.getFormSubmissionId()).isEqualTo(UPDATED_FORM_SUBMISSION_ID);
        assertThat(testFormSubmissionElement.getElementId()).isEqualTo(UPDATED_ELEMENT_ID);
        assertThat(testFormSubmissionElement.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingFormSubmissionElement() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionElementRepository.findAll().size();
        formSubmissionElement.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormSubmissionElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formSubmissionElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formSubmissionElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormSubmissionElement() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionElementRepository.findAll().size();
        formSubmissionElement.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormSubmissionElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formSubmissionElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormSubmissionElement() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionElementRepository.findAll().size();
        formSubmissionElement.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormSubmissionElementMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formSubmissionElement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormSubmissionElement in the database
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormSubmissionElement() throws Exception {
        // Initialize the database
        formSubmissionElementRepository.saveAndFlush(formSubmissionElement);

        int databaseSizeBeforeDelete = formSubmissionElementRepository.findAll().size();

        // Delete the formSubmissionElement
        restFormSubmissionElementMockMvc
            .perform(delete(ENTITY_API_URL_ID, formSubmissionElement.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormSubmissionElement> formSubmissionElementList = formSubmissionElementRepository.findAll();
        assertThat(formSubmissionElementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
