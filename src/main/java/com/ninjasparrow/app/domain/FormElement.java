package com.ninjasparrow.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FormElement.
 */
@Entity
@Table(name = "form_element")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FormElement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "form_id")
    private UUID formId;

    @Column(name = "element_type_id")
    private UUID elementTypeId;

    @Column(name = "lookup_field_id")
    private UUID lookupFieldId;

    @OneToOne
    @JoinColumn(unique = true)
    private ElementType elementTypeId;

    @JsonIgnoreProperties(value = { "formId" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private LookupField lookupFieldId;

    @OneToMany(mappedBy = "elementId")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "elementId", "formSubmissionId" }, allowSetters = true)
    private Set<FormSubmissionElement> formSubmissionElements = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "formElements", "formSubmissions", "lookupFields" }, allowSetters = true)
    private Form formId;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public FormElement id(UUID id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public FormElement name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getFormId() {
        return this.formId;
    }

    public FormElement formId(UUID formId) {
        this.formId = formId;
        return this;
    }

    public void setFormId(UUID formId) {
        this.formId = formId;
    }

    public UUID getElementTypeId() {
        return this.elementTypeId;
    }

    public FormElement elementTypeId(UUID elementTypeId) {
        this.elementTypeId = elementTypeId;
        return this;
    }

    public void setElementTypeId(UUID elementTypeId) {
        this.elementTypeId = elementTypeId;
    }

    public UUID getLookupFieldId() {
        return this.lookupFieldId;
    }

    public FormElement lookupFieldId(UUID lookupFieldId) {
        this.lookupFieldId = lookupFieldId;
        return this;
    }

    public void setLookupFieldId(UUID lookupFieldId) {
        this.lookupFieldId = lookupFieldId;
    }

    public ElementType getElementTypeId() {
        return this.elementTypeId;
    }

    public FormElement elementTypeId(ElementType elementType) {
        this.setElementTypeId(elementType);
        return this;
    }

    public void setElementTypeId(ElementType elementType) {
        this.elementTypeId = elementType;
    }

    public LookupField getLookupFieldId() {
        return this.lookupFieldId;
    }

    public FormElement lookupFieldId(LookupField lookupField) {
        this.setLookupFieldId(lookupField);
        return this;
    }

    public void setLookupFieldId(LookupField lookupField) {
        this.lookupFieldId = lookupField;
    }

    public Set<FormSubmissionElement> getFormSubmissionElements() {
        return this.formSubmissionElements;
    }

    public FormElement formSubmissionElements(Set<FormSubmissionElement> formSubmissionElements) {
        this.setFormSubmissionElements(formSubmissionElements);
        return this;
    }

    public FormElement addFormSubmissionElement(FormSubmissionElement formSubmissionElement) {
        this.formSubmissionElements.add(formSubmissionElement);
        formSubmissionElement.setElementId(this);
        return this;
    }

    public FormElement removeFormSubmissionElement(FormSubmissionElement formSubmissionElement) {
        this.formSubmissionElements.remove(formSubmissionElement);
        formSubmissionElement.setElementId(null);
        return this;
    }

    public void setFormSubmissionElements(Set<FormSubmissionElement> formSubmissionElements) {
        if (this.formSubmissionElements != null) {
            this.formSubmissionElements.forEach(i -> i.setElementId(null));
        }
        if (formSubmissionElements != null) {
            formSubmissionElements.forEach(i -> i.setElementId(this));
        }
        this.formSubmissionElements = formSubmissionElements;
    }

    public Form getFormId() {
        return this.formId;
    }

    public FormElement formId(Form form) {
        this.setFormId(form);
        return this;
    }

    public void setFormId(Form form) {
        this.formId = form;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormElement)) {
            return false;
        }
        return id != null && id.equals(((FormElement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormElement{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", formId='" + getFormId() + "'" +
            ", elementTypeId='" + getElementTypeId() + "'" +
            ", lookupFieldId='" + getLookupFieldId() + "'" +
            "}";
    }
}
