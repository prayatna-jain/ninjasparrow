package com.ninjasparrow.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ninjasparrow.app.IntegrationTest;
import com.ninjasparrow.app.domain.LookupField;
import com.ninjasparrow.app.repository.LookupFieldRepository;
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
 * Integration tests for the {@link LookupFieldResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LookupFieldResourceIT {

    private static final UUID DEFAULT_FORM_ID = UUID.randomUUID();
    private static final UUID UPDATED_FORM_ID = UUID.randomUUID();

    private static final UUID DEFAULT_ELEMENT_ID = UUID.randomUUID();
    private static final UUID UPDATED_ELEMENT_ID = UUID.randomUUID();

    private static final String ENTITY_API_URL = "/api/lookup-fields";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private LookupFieldRepository lookupFieldRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLookupFieldMockMvc;

    private LookupField lookupField;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LookupField createEntity(EntityManager em) {
        LookupField lookupField = new LookupField().formId(DEFAULT_FORM_ID).elementId(DEFAULT_ELEMENT_ID);
        return lookupField;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LookupField createUpdatedEntity(EntityManager em) {
        LookupField lookupField = new LookupField().formId(UPDATED_FORM_ID).elementId(UPDATED_ELEMENT_ID);
        return lookupField;
    }

    @BeforeEach
    public void initTest() {
        lookupField = createEntity(em);
    }

    @Test
    @Transactional
    void createLookupField() throws Exception {
        int databaseSizeBeforeCreate = lookupFieldRepository.findAll().size();
        // Create the LookupField
        restLookupFieldMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lookupField)))
            .andExpect(status().isCreated());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeCreate + 1);
        LookupField testLookupField = lookupFieldList.get(lookupFieldList.size() - 1);
        assertThat(testLookupField.getFormId()).isEqualTo(DEFAULT_FORM_ID);
        assertThat(testLookupField.getElementId()).isEqualTo(DEFAULT_ELEMENT_ID);
    }

    @Test
    @Transactional
    void createLookupFieldWithExistingId() throws Exception {
        // Create the LookupField with an existing ID
        lookupFieldRepository.saveAndFlush(lookupField);

        int databaseSizeBeforeCreate = lookupFieldRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLookupFieldMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lookupField)))
            .andExpect(status().isBadRequest());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLookupFields() throws Exception {
        // Initialize the database
        lookupFieldRepository.saveAndFlush(lookupField);

        // Get all the lookupFieldList
        restLookupFieldMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lookupField.getId().toString())))
            .andExpect(jsonPath("$.[*].formId").value(hasItem(DEFAULT_FORM_ID.toString())))
            .andExpect(jsonPath("$.[*].elementId").value(hasItem(DEFAULT_ELEMENT_ID.toString())));
    }

    @Test
    @Transactional
    void getLookupField() throws Exception {
        // Initialize the database
        lookupFieldRepository.saveAndFlush(lookupField);

        // Get the lookupField
        restLookupFieldMockMvc
            .perform(get(ENTITY_API_URL_ID, lookupField.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lookupField.getId().toString()))
            .andExpect(jsonPath("$.formId").value(DEFAULT_FORM_ID.toString()))
            .andExpect(jsonPath("$.elementId").value(DEFAULT_ELEMENT_ID.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLookupField() throws Exception {
        // Get the lookupField
        restLookupFieldMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLookupField() throws Exception {
        // Initialize the database
        lookupFieldRepository.saveAndFlush(lookupField);

        int databaseSizeBeforeUpdate = lookupFieldRepository.findAll().size();

        // Update the lookupField
        LookupField updatedLookupField = lookupFieldRepository.findById(lookupField.getId()).get();
        // Disconnect from session so that the updates on updatedLookupField are not directly saved in db
        em.detach(updatedLookupField);
        updatedLookupField.formId(UPDATED_FORM_ID).elementId(UPDATED_ELEMENT_ID);

        restLookupFieldMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLookupField.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLookupField))
            )
            .andExpect(status().isOk());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeUpdate);
        LookupField testLookupField = lookupFieldList.get(lookupFieldList.size() - 1);
        assertThat(testLookupField.getFormId()).isEqualTo(UPDATED_FORM_ID);
        assertThat(testLookupField.getElementId()).isEqualTo(UPDATED_ELEMENT_ID);
    }

    @Test
    @Transactional
    void putNonExistingLookupField() throws Exception {
        int databaseSizeBeforeUpdate = lookupFieldRepository.findAll().size();
        lookupField.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLookupFieldMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lookupField.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lookupField))
            )
            .andExpect(status().isBadRequest());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLookupField() throws Exception {
        int databaseSizeBeforeUpdate = lookupFieldRepository.findAll().size();
        lookupField.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLookupFieldMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lookupField))
            )
            .andExpect(status().isBadRequest());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLookupField() throws Exception {
        int databaseSizeBeforeUpdate = lookupFieldRepository.findAll().size();
        lookupField.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLookupFieldMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lookupField)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLookupFieldWithPatch() throws Exception {
        // Initialize the database
        lookupFieldRepository.saveAndFlush(lookupField);

        int databaseSizeBeforeUpdate = lookupFieldRepository.findAll().size();

        // Update the lookupField using partial update
        LookupField partialUpdatedLookupField = new LookupField();
        partialUpdatedLookupField.setId(lookupField.getId());

        partialUpdatedLookupField.formId(UPDATED_FORM_ID);

        restLookupFieldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLookupField.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLookupField))
            )
            .andExpect(status().isOk());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeUpdate);
        LookupField testLookupField = lookupFieldList.get(lookupFieldList.size() - 1);
        assertThat(testLookupField.getFormId()).isEqualTo(UPDATED_FORM_ID);
        assertThat(testLookupField.getElementId()).isEqualTo(DEFAULT_ELEMENT_ID);
    }

    @Test
    @Transactional
    void fullUpdateLookupFieldWithPatch() throws Exception {
        // Initialize the database
        lookupFieldRepository.saveAndFlush(lookupField);

        int databaseSizeBeforeUpdate = lookupFieldRepository.findAll().size();

        // Update the lookupField using partial update
        LookupField partialUpdatedLookupField = new LookupField();
        partialUpdatedLookupField.setId(lookupField.getId());

        partialUpdatedLookupField.formId(UPDATED_FORM_ID).elementId(UPDATED_ELEMENT_ID);

        restLookupFieldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLookupField.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLookupField))
            )
            .andExpect(status().isOk());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeUpdate);
        LookupField testLookupField = lookupFieldList.get(lookupFieldList.size() - 1);
        assertThat(testLookupField.getFormId()).isEqualTo(UPDATED_FORM_ID);
        assertThat(testLookupField.getElementId()).isEqualTo(UPDATED_ELEMENT_ID);
    }

    @Test
    @Transactional
    void patchNonExistingLookupField() throws Exception {
        int databaseSizeBeforeUpdate = lookupFieldRepository.findAll().size();
        lookupField.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLookupFieldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lookupField.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lookupField))
            )
            .andExpect(status().isBadRequest());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLookupField() throws Exception {
        int databaseSizeBeforeUpdate = lookupFieldRepository.findAll().size();
        lookupField.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLookupFieldMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lookupField))
            )
            .andExpect(status().isBadRequest());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLookupField() throws Exception {
        int databaseSizeBeforeUpdate = lookupFieldRepository.findAll().size();
        lookupField.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLookupFieldMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(lookupField))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LookupField in the database
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLookupField() throws Exception {
        // Initialize the database
        lookupFieldRepository.saveAndFlush(lookupField);

        int databaseSizeBeforeDelete = lookupFieldRepository.findAll().size();

        // Delete the lookupField
        restLookupFieldMockMvc
            .perform(delete(ENTITY_API_URL_ID, lookupField.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LookupField> lookupFieldList = lookupFieldRepository.findAll();
        assertThat(lookupFieldList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
