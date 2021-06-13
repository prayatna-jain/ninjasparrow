package com.ninjasparrow.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ninjasparrow.app.IntegrationTest;
import com.ninjasparrow.app.domain.FormElement;
import com.ninjasparrow.app.repository.FormElementRepository;
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
 * Integration tests for the {@link FormElementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FormElementResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/form-elements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private FormElementRepository formElementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormElementMockMvc;

    private FormElement formElement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormElement createEntity(EntityManager em) {
        FormElement formElement = new FormElement().name(DEFAULT_NAME);
        return formElement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FormElement createUpdatedEntity(EntityManager em) {
        FormElement formElement = new FormElement().name(UPDATED_NAME);
        return formElement;
    }

    @BeforeEach
    public void initTest() {
        formElement = createEntity(em);
    }

    @Test
    @Transactional
    void createFormElement() throws Exception {
        int databaseSizeBeforeCreate = formElementRepository.findAll().size();
        // Create the FormElement
        restFormElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formElement)))
            .andExpect(status().isCreated());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeCreate + 1);
        FormElement testFormElement = formElementList.get(formElementList.size() - 1);
        assertThat(testFormElement.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createFormElementWithExistingId() throws Exception {
        // Create the FormElement with an existing ID
        formElementRepository.saveAndFlush(formElement);

        int databaseSizeBeforeCreate = formElementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormElementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formElement)))
            .andExpect(status().isBadRequest());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFormElements() throws Exception {
        // Initialize the database
        formElementRepository.saveAndFlush(formElement);

        // Get all the formElementList
        restFormElementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formElement.getId().toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getFormElement() throws Exception {
        // Initialize the database
        formElementRepository.saveAndFlush(formElement);

        // Get the formElement
        restFormElementMockMvc
            .perform(get(ENTITY_API_URL_ID, formElement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formElement.getId().toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingFormElement() throws Exception {
        // Get the formElement
        restFormElementMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFormElement() throws Exception {
        // Initialize the database
        formElementRepository.saveAndFlush(formElement);

        int databaseSizeBeforeUpdate = formElementRepository.findAll().size();

        // Update the formElement
        FormElement updatedFormElement = formElementRepository.findById(formElement.getId()).get();
        // Disconnect from session so that the updates on updatedFormElement are not directly saved in db
        em.detach(updatedFormElement);
        updatedFormElement.name(UPDATED_NAME);

        restFormElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormElement))
            )
            .andExpect(status().isOk());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeUpdate);
        FormElement testFormElement = formElementList.get(formElementList.size() - 1);
        assertThat(testFormElement.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingFormElement() throws Exception {
        int databaseSizeBeforeUpdate = formElementRepository.findAll().size();
        formElement.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formElement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormElement() throws Exception {
        int databaseSizeBeforeUpdate = formElementRepository.findAll().size();
        formElement.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormElementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormElement() throws Exception {
        int databaseSizeBeforeUpdate = formElementRepository.findAll().size();
        formElement.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormElementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formElement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormElementWithPatch() throws Exception {
        // Initialize the database
        formElementRepository.saveAndFlush(formElement);

        int databaseSizeBeforeUpdate = formElementRepository.findAll().size();

        // Update the formElement using partial update
        FormElement partialUpdatedFormElement = new FormElement();
        partialUpdatedFormElement.setId(formElement.getId());

        restFormElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormElement))
            )
            .andExpect(status().isOk());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeUpdate);
        FormElement testFormElement = formElementList.get(formElementList.size() - 1);
        assertThat(testFormElement.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateFormElementWithPatch() throws Exception {
        // Initialize the database
        formElementRepository.saveAndFlush(formElement);

        int databaseSizeBeforeUpdate = formElementRepository.findAll().size();

        // Update the formElement using partial update
        FormElement partialUpdatedFormElement = new FormElement();
        partialUpdatedFormElement.setId(formElement.getId());

        partialUpdatedFormElement.name(UPDATED_NAME);

        restFormElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormElement))
            )
            .andExpect(status().isOk());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeUpdate);
        FormElement testFormElement = formElementList.get(formElementList.size() - 1);
        assertThat(testFormElement.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingFormElement() throws Exception {
        int databaseSizeBeforeUpdate = formElementRepository.findAll().size();
        formElement.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formElement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormElement() throws Exception {
        int databaseSizeBeforeUpdate = formElementRepository.findAll().size();
        formElement.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormElementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formElement))
            )
            .andExpect(status().isBadRequest());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormElement() throws Exception {
        int databaseSizeBeforeUpdate = formElementRepository.findAll().size();
        formElement.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormElementMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(formElement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FormElement in the database
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormElement() throws Exception {
        // Initialize the database
        formElementRepository.saveAndFlush(formElement);

        int databaseSizeBeforeDelete = formElementRepository.findAll().size();

        // Delete the formElement
        restFormElementMockMvc
            .perform(delete(ENTITY_API_URL_ID, formElement.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FormElement> formElementList = formElementRepository.findAll();
        assertThat(formElementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
