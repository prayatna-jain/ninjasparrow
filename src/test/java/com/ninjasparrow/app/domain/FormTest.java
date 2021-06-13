package com.ninjasparrow.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninjasparrow.app.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class FormTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Form.class);
        Form form1 = new Form();
        form1.setId(UUID.randomUUID());
        Form form2 = new Form();
        form2.setId(form1.getId());
        assertThat(form1).isEqualTo(form2);
        form2.setId(UUID.randomUUID());
        assertThat(form1).isNotEqualTo(form2);
        form1.setId(null);
        assertThat(form1).isNotEqualTo(form2);
    }
}
