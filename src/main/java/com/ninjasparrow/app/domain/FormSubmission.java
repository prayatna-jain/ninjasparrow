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
 * A FormSubmission.
 */
@Entity
@Table(name = "form_submission")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class FormSubmission implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID id;

    @OneToMany(mappedBy = "formSubmissionId")
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

    public FormSubmission id(UUID id) {
        this.id = id;
        return this;
    }

    public Set<FormSubmissionElement> getFormSubmissionElements() {
        return this.formSubmissionElements;
    }

    public FormSubmission formSubmissionElements(Set<FormSubmissionElement> formSubmissionElements) {
        this.setFormSubmissionElements(formSubmissionElements);
        return this;
    }

    public FormSubmission addFormSubmissionElement(FormSubmissionElement formSubmissionElement) {
        this.formSubmissionElements.add(formSubmissionElement);
        formSubmissionElement.setFormSubmissionId(this);
        return this;
    }

    public FormSubmission removeFormSubmissionElement(FormSubmissionElement formSubmissionElement) {
        this.formSubmissionElements.remove(formSubmissionElement);
        formSubmissionElement.setFormSubmissionId(null);
        return this;
    }

    public void setFormSubmissionElements(Set<FormSubmissionElement> formSubmissionElements) {
        if (this.formSubmissionElements != null) {
            this.formSubmissionElements.forEach(i -> i.setFormSubmissionId(null));
        }
        if (formSubmissionElements != null) {
            formSubmissionElements.forEach(i -> i.setFormSubmissionId(this));
        }
        this.formSubmissionElements = formSubmissionElements;
    }

    public Form getFormId() {
        return this.formId;
    }

    public FormSubmission formId(Form form) {
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
        if (!(o instanceof FormSubmission)) {
            return false;
        }
        return id != null && id.equals(((FormSubmission) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormSubmission{" +
            "id=" + getId() +
            "}";
    }
}
