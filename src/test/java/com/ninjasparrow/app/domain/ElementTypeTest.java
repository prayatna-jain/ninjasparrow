package com.ninjasparrow.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.ninjasparrow.app.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class ElementTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ElementType.class);
        ElementType elementType1 = new ElementType();
        elementType1.setId(UUID.randomUUID());
        ElementType elementType2 = new ElementType();
        elementType2.setId(elementType1.getId());
        assertThat(elementType1).isEqualTo(elementType2);
        elementType2.setId(UUID.randomUUID());
        assertThat(elementType1).isNotEqualTo(elementType2);
        elementType1.setId(null);
        assertThat(elementType1).isNotEqualTo(elementType2);
    }
}
