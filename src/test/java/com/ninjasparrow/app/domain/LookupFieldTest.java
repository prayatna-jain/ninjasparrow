package com.ninjasparrow.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninjasparrow.app.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class LookupFieldTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LookupField.class);
        LookupField lookupField1 = new LookupField();
        lookupField1.setId(UUID.randomUUID());
        LookupField lookupField2 = new LookupField();
        lookupField2.setId(lookupField1.getId());
        assertThat(lookupField1).isEqualTo(lookupField2);
        lookupField2.setId(UUID.randomUUID());
        assertThat(lookupField1).isNotEqualTo(lookupField2);
        lookupField1.setId(null);
        assertThat(lookupField1).isNotEqualTo(lookupField2);
    }
}
