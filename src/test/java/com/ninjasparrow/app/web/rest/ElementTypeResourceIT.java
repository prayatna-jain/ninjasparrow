package com.ninjasparrow.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ninjasparrow.app.IntegrationTest;
import com.ninjasparrow.app.domain.ElementType;
import com.ninjasparrow.app.repository.ElementTypeRepository;
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
 * Integration tests for the {@link ElementTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ElementTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/element-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ElementTypeRepository elementTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restElementTypeMockMvc;

    private ElementType elementType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ElementType createEntity(EntityManager em) {
        ElementType elementType = new ElementType().name(DEFAULT_NAME);
        return elementType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ElementType createUpdatedEntity(EntityManager em) {
        ElementType elementType = new ElementType().name(UPDATED_NAME);
        return elementType;
    }

    @BeforeEach
    public void initTest() {
        elementType = createEntity(em);
    }

    @Test
    @Transactional
    void createElementType() throws Exception {
        int databaseSizeBeforeCreate = elementTypeRepository.findAll().size();
        // Create the ElementType
        restElementTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(elementType)))
            .andExpect(status().isCreated());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeCreate + 1);
        ElementType testElementType = elementTypeList.get(elementTypeList.size() - 1);
        assertThat(testElementType.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createElementTypeWithExistingId() throws Exception {
        // Create the ElementType with an existing ID
        elementTypeRepository.saveAndFlush(elementType);

        int databaseSizeBeforeCreate = elementTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restElementTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(elementType)))
            .andExpect(status().isBadRequest());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllElementTypes() throws Exception {
        // Initialize the database
        elementTypeRepository.saveAndFlush(elementType);

        // Get all the elementTypeList
        restElementTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(elementType.getId().toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getElementType() throws Exception {
        // Initialize the database
        elementTypeRepository.saveAndFlush(elementType);

        // Get the elementType
        restElementTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, elementType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(elementType.getId().toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingElementType() throws Exception {
        // Get the elementType
        restElementTypeMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewElementType() throws Exception {
        // Initialize the database
        elementTypeRepository.saveAndFlush(elementType);

        int databaseSizeBeforeUpdate = elementTypeRepository.findAll().size();

        // Update the elementType
        ElementType updatedElementType = elementTypeRepository.findById(elementType.getId()).get();
        // Disconnect from session so that the updates on updatedElementType are not directly saved in db
        em.detach(updatedElementType);
        updatedElementType.name(UPDATED_NAME);

        restElementTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedElementType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedElementType))
            )
            .andExpect(status().isOk());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeUpdate);
        ElementType testElementType = elementTypeList.get(elementTypeList.size() - 1);
        assertThat(testElementType.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingElementType() throws Exception {
        int databaseSizeBeforeUpdate = elementTypeRepository.findAll().size();
        elementType.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restElementTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, elementType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(elementType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchElementType() throws Exception {
        int databaseSizeBeforeUpdate = elementTypeRepository.findAll().size();
        elementType.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(elementType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamElementType() throws Exception {
        int databaseSizeBeforeUpdate = elementTypeRepository.findAll().size();
        elementType.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementTypeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(elementType)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateElementTypeWithPatch() throws Exception {
        // Initialize the database
        elementTypeRepository.saveAndFlush(elementType);

        int databaseSizeBeforeUpdate = elementTypeRepository.findAll().size();

        // Update the elementType using partial update
        ElementType partialUpdatedElementType = new ElementType();
        partialUpdatedElementType.setId(elementType.getId());

        partialUpdatedElementType.name(UPDATED_NAME);

        restElementTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedElementType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedElementType))
            )
            .andExpect(status().isOk());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeUpdate);
        ElementType testElementType = elementTypeList.get(elementTypeList.size() - 1);
        assertThat(testElementType.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateElementTypeWithPatch() throws Exception {
        // Initialize the database
        elementTypeRepository.saveAndFlush(elementType);

        int databaseSizeBeforeUpdate = elementTypeRepository.findAll().size();

        // Update the elementType using partial update
        ElementType partialUpdatedElementType = new ElementType();
        partialUpdatedElementType.setId(elementType.getId());

        partialUpdatedElementType.name(UPDATED_NAME);

        restElementTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedElementType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedElementType))
            )
            .andExpect(status().isOk());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeUpdate);
        ElementType testElementType = elementTypeList.get(elementTypeList.size() - 1);
        assertThat(testElementType.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingElementType() throws Exception {
        int databaseSizeBeforeUpdate = elementTypeRepository.findAll().size();
        elementType.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restElementTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, elementType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(elementType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchElementType() throws Exception {
        int databaseSizeBeforeUpdate = elementTypeRepository.findAll().size();
        elementType.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(elementType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamElementType() throws Exception {
        int databaseSizeBeforeUpdate = elementTypeRepository.findAll().size();
        elementType.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restElementTypeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(elementType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ElementType in the database
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteElementType() throws Exception {
        // Initialize the database
        elementTypeRepository.saveAndFlush(elementType);

        int databaseSizeBeforeDelete = elementTypeRepository.findAll().size();

        // Delete the elementType
        restElementTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, elementType.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ElementType> elementTypeList = elementTypeRepository.findAll();
        assertThat(elementTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
