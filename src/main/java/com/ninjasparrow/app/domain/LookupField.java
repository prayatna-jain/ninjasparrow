package com.ninjasparrow.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LookupField.
 */
@Entity
@Table(name = "lookup_field")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class LookupField implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "form_id")
    private UUID formId;

    @Column(name = "element_id")
    private UUID elementId;

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

    public LookupField id(UUID id) {
        this.id = id;
        return this;
    }

    public UUID getFormId() {
        return this.formId;
    }

    public LookupField formId(UUID formId) {
        this.formId = formId;
        return this;
    }

    public void setFormId(UUID formId) {
        this.formId = formId;
    }

    public UUID getElementId() {
        return this.elementId;
    }

    public LookupField elementId(UUID elementId) {
        this.elementId = elementId;
        return this;
    }

    public void setElementId(UUID elementId) {
        this.elementId = elementId;
    }

    public Form getFormId() {
        return this.formId;
    }

    public LookupField formId(Form form) {
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
        if (!(o instanceof LookupField)) {
            return false;
        }
        return id != null && id.equals(((LookupField) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LookupField{" +
            "id=" + getId() +
            ", formId='" + getFormId() + "'" +
            ", elementId='" + getElementId() + "'" +
            "}";
    }
}
