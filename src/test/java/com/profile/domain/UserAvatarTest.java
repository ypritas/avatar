package com.profile.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.profile.web.rest.TestUtil;

public class UserAvatarTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserAvatar.class);
        UserAvatar userAvatar1 = new UserAvatar();
        userAvatar1.setId(1L);
        UserAvatar userAvatar2 = new UserAvatar();
        userAvatar2.setId(userAvatar1.getId());
        assertThat(userAvatar1).isEqualTo(userAvatar2);
        userAvatar2.setId(2L);
        assertThat(userAvatar1).isNotEqualTo(userAvatar2);
        userAvatar1.setId(null);
        assertThat(userAvatar1).isNotEqualTo(userAvatar2);
    }
}
