package com.ninjasparrow.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninjasparrow.app.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class FormElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormElement.class);
        FormElement formElement1 = new FormElement();
        formElement1.setId(UUID.randomUUID());
        FormElement formElement2 = new FormElement();
        formElement2.setId(formElement1.getId());
        assertThat(formElement1).isEqualTo(formElement2);
        formElement2.setId(UUID.randomUUID());
        assertThat(formElement1).isNotEqualTo(formElement2);
        formElement1.setId(null);
        assertThat(formElement1).isNotEqualTo(formElement2);
    }
}
