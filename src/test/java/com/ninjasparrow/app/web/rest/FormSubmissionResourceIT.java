package com.ninjasparrow.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ninjasparrow.app.IntegrationTest;
import com.ninjasparrow.app.domain.FormSubmission;
import com.ninjasparrow.app.repository.FormSubmissionRepository;
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
 * Integration tests for the {@link FormSubmissionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormSubmissionResourceIT {

    private static final UUID DEFAULT_FORM_ID = UUID.randomUUID();
    private static final UUID UPDATED_FORM_ID = UUID.randomUUID();

    private static final String ENTITY_API_URL = "/api/form-submissions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private FormSubmissionRepository formSubmissionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormSubmissionMockMvc;

    private FormSubmission formSubmission;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormSubmission createEntity(EntityManager em) {
        FormSubmission formSubmission = new FormSubmission().formId(DEFAULT_FORM_ID);
        return formSubmission;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormSubmission createUpdatedEntity(EntityManager em) {
        FormSubmission formSubmission = new FormSubmission().formId(UPDATED_FORM_ID);
        return formSubmission;
    }

    @BeforeEach
    public void initTest() {
        formSubmission = createEntity(em);
    }

    @Test
    @Transactional
    void createFormSubmission() throws Exception {
        int databaseSizeBeforeCreate = formSubmissionRepository.findAll().size();
        // Create the FormSubmission
        restFormSubmissionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formSubmission))
            )
            .andExpect(status().isCreated());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeCreate + 1);
        FormSubmission testFormSubmission = formSubmissionList.get(formSubmissionList.size() - 1);
        assertThat(testFormSubmission.getFormId()).isEqualTo(DEFAULT_FORM_ID);
    }

    @Test
    @Transactional
    void createFormSubmissionWithExistingId() throws Exception {
        // Create the FormSubmission with an existing ID
        formSubmissionRepository.saveAndFlush(formSubmission);

        int databaseSizeBeforeCreate = formSubmissionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormSubmissionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formSubmission))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFormSubmissions() throws Exception {
        // Initialize the database
        formSubmissionRepository.saveAndFlush(formSubmission);

        // Get all the formSubmissionList
        restFormSubmissionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formSubmission.getId().toString())))
            .andExpect(jsonPath("$.[*].formId").value(hasItem(DEFAULT_FORM_ID.toString())));
    }

    @Test
    @Transactional
    void getFormSubmission() throws Exception {
        // Initialize the database
        formSubmissionRepository.saveAndFlush(formSubmission);

        // Get the formSubmission
        restFormSubmissionMockMvc
            .perform(get(ENTITY_API_URL_ID, formSubmission.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formSubmission.getId().toString()))
            .andExpect(jsonPath("$.formId").value(DEFAULT_FORM_ID.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFormSubmission() throws Exception {
        // Get the formSubmission
        restFormSubmissionMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFormSubmission() throws Exception {
        // Initialize the database
        formSubmissionRepository.saveAndFlush(formSubmission);

        int databaseSizeBeforeUpdate = formSubmissionRepository.findAll().size();

        // Update the formSubmission
        FormSubmission updatedFormSubmission = formSubmissionRepository.findById(formSubmission.getId()).get();
        // Disconnect from session so that the updates on updatedFormSubmission are not directly saved in db
        em.detach(updatedFormSubmission);
        updatedFormSubmission.formId(UPDATED_FORM_ID);

        restFormSubmissionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormSubmission.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormSubmission))
            )
            .andExpect(status().isOk());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeUpdate);
        FormSubmission testFormSubmission = formSubmissionList.get(formSubmissionList.size() - 1);
        assertThat(testFormSubmission.getFormId()).isEqualTo(UPDATED_FORM_ID);
    }

    @Test
    @Transactional
    void putNonExistingFormSubmission() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionRepository.findAll().size();
        formSubmission.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormSubmissionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formSubmission.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formSubmission))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormSubmission() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionRepository.findAll().size();
        formSubmission.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormSubmissionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formSubmission))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormSubmission() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionRepository.findAll().size();
        formSubmission.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormSubmissionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formSubmission)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormSubmissionWithPatch() throws Exception {
        // Initialize the database
        formSubmissionRepository.saveAndFlush(formSubmission);

        int databaseSizeBeforeUpdate = formSubmissionRepository.findAll().size();

        // Update the formSubmission using partial update
        FormSubmission partialUpdatedFormSubmission = new FormSubmission();
        partialUpdatedFormSubmission.setId(formSubmission.getId());

        restFormSubmissionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormSubmission.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormSubmission))
            )
            .andExpect(status().isOk());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeUpdate);
        FormSubmission testFormSubmission = formSubmissionList.get(formSubmissionList.size() - 1);
        assertThat(testFormSubmission.getFormId()).isEqualTo(DEFAULT_FORM_ID);
    }

    @Test
    @Transactional
    void fullUpdateFormSubmissionWithPatch() throws Exception {
        // Initialize the database
        formSubmissionRepository.saveAndFlush(formSubmission);

        int databaseSizeBeforeUpdate = formSubmissionRepository.findAll().size();

        // Update the formSubmission using partial update
        FormSubmission partialUpdatedFormSubmission = new FormSubmission();
        partialUpdatedFormSubmission.setId(formSubmission.getId());

        partialUpdatedFormSubmission.formId(UPDATED_FORM_ID);

        restFormSubmissionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormSubmission.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormSubmission))
            )
            .andExpect(status().isOk());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeUpdate);
        FormSubmission testFormSubmission = formSubmissionList.get(formSubmissionList.size() - 1);
        assertThat(testFormSubmission.getFormId()).isEqualTo(UPDATED_FORM_ID);
    }

    @Test
    @Transactional
    void patchNonExistingFormSubmission() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionRepository.findAll().size();
        formSubmission.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormSubmissionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formSubmission.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formSubmission))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormSubmission() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionRepository.findAll().size();
        formSubmission.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormSubmissionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formSubmission))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormSubmission() throws Exception {
        int databaseSizeBeforeUpdate = formSubmissionRepository.findAll().size();
        formSubmission.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormSubmissionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(formSubmission))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormSubmission in the database
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormSubmission() throws Exception {
        // Initialize the database
        formSubmissionRepository.saveAndFlush(formSubmission);

        int databaseSizeBeforeDelete = formSubmissionRepository.findAll().size();

        // Delete the formSubmission
        restFormSubmissionMockMvc
            .perform(delete(ENTITY_API_URL_ID, formSubmission.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormSubmission> formSubmissionList = formSubmissionRepository.findAll();
        assertThat(formSubmissionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
