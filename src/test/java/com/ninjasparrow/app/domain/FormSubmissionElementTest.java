package com.ninjasparrow.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninjasparrow.app.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class FormSubmissionElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormSubmissionElement.class);
        FormSubmissionElement formSubmissionElement1 = new FormSubmissionElement();
        formSubmissionElement1.setId(UUID.randomUUID());
        FormSubmissionElement formSubmissionElement2 = new FormSubmissionElement();
        formSubmissionElement2.setId(formSubmissionElement1.getId());
        assertThat(formSubmissionElement1).isEqualTo(formSubmissionElement2);
        formSubmissionElement2.setId(UUID.randomUUID());
        assertThat(formSubmissionElement1).isNotEqualTo(formSubmissionElement2);
        formSubmissionElement1.setId(null);
        assertThat(formSubmissionElement1).isNotEqualTo(formSubmissionElement2);
    }
}
