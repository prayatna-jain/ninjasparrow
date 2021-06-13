package com.ninjasparrow.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninjasparrow.app.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class FormSubmissionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormSubmission.class);
        FormSubmission formSubmission1 = new FormSubmission();
        formSubmission1.setId(UUID.randomUUID());
        FormSubmission formSubmission2 = new FormSubmission();
        formSubmission2.setId(formSubmission1.getId());
        assertThat(formSubmission1).isEqualTo(formSubmission2);
        formSubmission2.setId(UUID.randomUUID());
        assertThat(formSubmission1).isNotEqualTo(formSubmission2);
        formSubmission1.setId(null);
        assertThat(formSubmission1).isNotEqualTo(formSubmission2);
    }
}
