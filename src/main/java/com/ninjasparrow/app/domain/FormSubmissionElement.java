package com.ninjasparrow.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FormSubmissionElement.
 */
@Entity
@Table(name = "form_submission_element")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FormSubmissionElement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "form_submission_id")
    private UUID formSubmissionId;

    @Column(name = "element_id")
    private UUID elementId;

    @Column(name = "value")
    private String value;

    @ManyToOne
    @JsonIgnoreProperties(value = { "elementTypeId", "lookupFieldId", "formSubmissionElements", "formId" }, allowSetters = true)
    private FormElement elementId;

    @ManyToOne
    @JsonIgnoreProperties(value = { "formSubmissionElements", "formId" }, allowSetters = true)
    private FormSubmission formSubmissionId;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public FormSubmissionElement id(UUID id) {
        this.id = id;
        return this;
    }

    public UUID getFormSubmissionId() {
        return this.formSubmissionId;
    }

    public FormSubmissionElement formSubmissionId(UUID formSubmissionId) {
        this.formSubmissionId = formSubmissionId;
        return this;
    }

    public void setFormSubmissionId(UUID formSubmissionId) {
        this.formSubmissionId = formSubmissionId;
    }

    public UUID getElementId() {
        return this.elementId;
    }

    public FormSubmissionElement elementId(UUID elementId) {
        this.elementId = elementId;
        return this;
    }

    public void setElementId(UUID elementId) {
        this.elementId = elementId;
    }

    public String getValue() {
        return this.value;
    }

    public FormSubmissionElement value(String value) {
        this.value = value;
        return this;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public FormElement getElementId() {
        return this.elementId;
    }

    public FormSubmissionElement elementId(FormElement formElement) {
        this.setElementId(formElement);
        return this;
    }

    public void setElementId(FormElement formElement) {
        this.elementId = formElement;
    }

    public FormSubmission getFormSubmissionId() {
        return this.formSubmissionId;
    }

    public FormSubmissionElement formSubmissionId(FormSubmission formSubmission) {
        this.setFormSubmissionId(formSubmission);
        return this;
    }

    public void setFormSubmissionId(FormSubmission formSubmission) {
        this.formSubmissionId = formSubmission;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormSubmissionElement)) {
            return false;
        }
        return id != null && id.equals(((FormSubmissionElement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormSubmissionElement{" +
            "id=" + getId() +
            ", formSubmissionId='" + getFormSubmissionId() + "'" +
            ", elementId='" + getElementId() + "'" +
            ", value='" + getValue() + "'" +
            "}";
    }
}
