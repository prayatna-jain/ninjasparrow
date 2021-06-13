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
 * A Form.
 */
@Entity
@Table(name = "form")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Form implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "formId")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "elementTypeId", "lookupFieldId", "formSubmissionElements", "formId" }, allowSetters = true)
    private Set<FormElement> formElements = new HashSet<>();

    @OneToMany(mappedBy = "formId")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "formSubmissionElements", "formId" }, allowSetters = true)
    private Set<FormSubmission> formSubmissions = new HashSet<>();

    @OneToMany(mappedBy = "formId")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "formId" }, allowSetters = true)
    private Set<LookupField> lookupFields = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Form id(UUID id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Form name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<FormElement> getFormElements() {
        return this.formElements;
    }

    public Form formElements(Set<FormElement> formElements) {
        this.setFormElements(formElements);
        return this;
    }

    public Form addFormElement(FormElement formElement) {
        this.formElements.add(formElement);
        formElement.setFormId(this);
        return this;
    }

    public Form removeFormElement(FormElement formElement) {
        this.formElements.remove(formElement);
        formElement.setFormId(null);
        return this;
    }

    public void setFormElements(Set<FormElement> formElements) {
        if (this.formElements != null) {
            this.formElements.forEach(i -> i.setFormId(null));
        }
        if (formElements != null) {
            formElements.forEach(i -> i.setFormId(this));
        }
        this.formElements = formElements;
    }

    public Set<FormSubmission> getFormSubmissions() {
        return this.formSubmissions;
    }

    public Form formSubmissions(Set<FormSubmission> formSubmissions) {
        this.setFormSubmissions(formSubmissions);
        return this;
    }

    public Form addFormSubmission(FormSubmission formSubmission) {
        this.formSubmissions.add(formSubmission);
        formSubmission.setFormId(this);
        return this;
    }

    public Form removeFormSubmission(FormSubmission formSubmission) {
        this.formSubmissions.remove(formSubmission);
        formSubmission.setFormId(null);
        return this;
    }

    public void setFormSubmissions(Set<FormSubmission> formSubmissions) {
        if (this.formSubmissions != null) {
            this.formSubmissions.forEach(i -> i.setFormId(null));
        }
        if (formSubmissions != null) {
            formSubmissions.forEach(i -> i.setFormId(this));
        }
        this.formSubmissions = formSubmissions;
    }

    public Set<LookupField> getLookupFields() {
        return this.lookupFields;
    }

    public Form lookupFields(Set<LookupField> lookupFields) {
        this.setLookupFields(lookupFields);
        return this;
    }

    public Form addLookupField(LookupField lookupField) {
        this.lookupFields.add(lookupField);
        lookupField.setFormId(this);
        return this;
    }

    public Form removeLookupField(LookupField lookupField) {
        this.lookupFields.remove(lookupField);
        lookupField.setFormId(null);
        return this;
    }

    public void setLookupFields(Set<LookupField> lookupFields) {
        if (this.lookupFields != null) {
            this.lookupFields.forEach(i -> i.setFormId(null));
        }
        if (lookupFields != null) {
            lookupFields.forEach(i -> i.setFormId(this));
        }
        this.lookupFields = lookupFields;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Form)) {
            return false;
        }
        return id != null && id.equals(((Form) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Form{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
