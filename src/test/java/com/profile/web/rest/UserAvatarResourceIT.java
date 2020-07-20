package com.profile.web.rest;

import com.profile.AvatarApp;
import com.profile.config.TestSecurityConfiguration;
import com.profile.domain.UserAvatar;
import com.profile.repository.UserAvatarRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link UserAvatarResource} REST controller.
 */
@SpringBootTest(classes = { AvatarApp.class, TestSecurityConfiguration.class })
@AutoConfigureMockMvc
@WithMockUser
public class UserAvatarResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_AVATAR = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_AVATAR = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_AVATAR_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_AVATAR_CONTENT_TYPE = "image/png";

    private static final Instant DEFAULT_UPLOADED = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPLOADED = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private UserAvatarRepository userAvatarRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserAvatarMockMvc;

    private UserAvatar userAvatar;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserAvatar createEntity(EntityManager em) {
        UserAvatar userAvatar = new UserAvatar()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .avatar(DEFAULT_AVATAR)
            .avatarContentType(DEFAULT_AVATAR_CONTENT_TYPE)
            .uploaded(DEFAULT_UPLOADED);
        return userAvatar;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserAvatar createUpdatedEntity(EntityManager em) {
        UserAvatar userAvatar = new UserAvatar()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .avatar(UPDATED_AVATAR)
            .avatarContentType(UPDATED_AVATAR_CONTENT_TYPE)
            .uploaded(UPDATED_UPLOADED);
        return userAvatar;
    }

    @BeforeEach
    public void initTest() {
        userAvatar = createEntity(em);
    }

    @Test
    @Transactional
    public void createUserAvatar() throws Exception {
        int databaseSizeBeforeCreate = userAvatarRepository.findAll().size();
        // Create the UserAvatar
        restUserAvatarMockMvc.perform(post("/api/user-avatars").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userAvatar)))
            .andExpect(status().isCreated());

        // Validate the UserAvatar in the database
        List<UserAvatar> userAvatarList = userAvatarRepository.findAll();
        assertThat(userAvatarList).hasSize(databaseSizeBeforeCreate + 1);
        UserAvatar testUserAvatar = userAvatarList.get(userAvatarList.size() - 1);
        assertThat(testUserAvatar.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testUserAvatar.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testUserAvatar.getAvatar()).isEqualTo(DEFAULT_AVATAR);
        assertThat(testUserAvatar.getAvatarContentType()).isEqualTo(DEFAULT_AVATAR_CONTENT_TYPE);
        assertThat(testUserAvatar.getUploaded()).isEqualTo(DEFAULT_UPLOADED);
    }

    @Test
    @Transactional
    public void createUserAvatarWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userAvatarRepository.findAll().size();

        // Create the UserAvatar with an existing ID
        userAvatar.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserAvatarMockMvc.perform(post("/api/user-avatars").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userAvatar)))
            .andExpect(status().isBadRequest());

        // Validate the UserAvatar in the database
        List<UserAvatar> userAvatarList = userAvatarRepository.findAll();
        assertThat(userAvatarList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = userAvatarRepository.findAll().size();
        // set the field null
        userAvatar.setName(null);

        // Create the UserAvatar, which fails.


        restUserAvatarMockMvc.perform(post("/api/user-avatars").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userAvatar)))
            .andExpect(status().isBadRequest());

        List<UserAvatar> userAvatarList = userAvatarRepository.findAll();
        assertThat(userAvatarList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUserAvatars() throws Exception {
        // Initialize the database
        userAvatarRepository.saveAndFlush(userAvatar);

        // Get all the userAvatarList
        restUserAvatarMockMvc.perform(get("/api/user-avatars?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userAvatar.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].avatarContentType").value(hasItem(DEFAULT_AVATAR_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].avatar").value(hasItem(Base64Utils.encodeToString(DEFAULT_AVATAR))))
            .andExpect(jsonPath("$.[*].uploaded").value(hasItem(DEFAULT_UPLOADED.toString())));
    }
    
    @Test
    @Transactional
    public void getUserAvatar() throws Exception {
        // Initialize the database
        userAvatarRepository.saveAndFlush(userAvatar);

        // Get the userAvatar
        restUserAvatarMockMvc.perform(get("/api/user-avatars/{id}", userAvatar.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userAvatar.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.avatarContentType").value(DEFAULT_AVATAR_CONTENT_TYPE))
            .andExpect(jsonPath("$.avatar").value(Base64Utils.encodeToString(DEFAULT_AVATAR)))
            .andExpect(jsonPath("$.uploaded").value(DEFAULT_UPLOADED.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingUserAvatar() throws Exception {
        // Get the userAvatar
        restUserAvatarMockMvc.perform(get("/api/user-avatars/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUserAvatar() throws Exception {
        // Initialize the database
        userAvatarRepository.saveAndFlush(userAvatar);

        int databaseSizeBeforeUpdate = userAvatarRepository.findAll().size();

        // Update the userAvatar
        UserAvatar updatedUserAvatar = userAvatarRepository.findById(userAvatar.getId()).get();
        // Disconnect from session so that the updates on updatedUserAvatar are not directly saved in db
        em.detach(updatedUserAvatar);
        updatedUserAvatar
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .avatar(UPDATED_AVATAR)
            .avatarContentType(UPDATED_AVATAR_CONTENT_TYPE)
            .uploaded(UPDATED_UPLOADED);

        restUserAvatarMockMvc.perform(put("/api/user-avatars").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedUserAvatar)))
            .andExpect(status().isOk());

        // Validate the UserAvatar in the database
        List<UserAvatar> userAvatarList = userAvatarRepository.findAll();
        assertThat(userAvatarList).hasSize(databaseSizeBeforeUpdate);
        UserAvatar testUserAvatar = userAvatarList.get(userAvatarList.size() - 1);
        assertThat(testUserAvatar.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testUserAvatar.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testUserAvatar.getAvatar()).isEqualTo(UPDATED_AVATAR);
        assertThat(testUserAvatar.getAvatarContentType()).isEqualTo(UPDATED_AVATAR_CONTENT_TYPE);
        assertThat(testUserAvatar.getUploaded()).isEqualTo(UPDATED_UPLOADED);
    }

    @Test
    @Transactional
    public void updateNonExistingUserAvatar() throws Exception {
        int databaseSizeBeforeUpdate = userAvatarRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserAvatarMockMvc.perform(put("/api/user-avatars").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userAvatar)))
            .andExpect(status().isBadRequest());

        // Validate the UserAvatar in the database
        List<UserAvatar> userAvatarList = userAvatarRepository.findAll();
        assertThat(userAvatarList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUserAvatar() throws Exception {
        // Initialize the database
        userAvatarRepository.saveAndFlush(userAvatar);

        int databaseSizeBeforeDelete = userAvatarRepository.findAll().size();

        // Delete the userAvatar
        restUserAvatarMockMvc.perform(delete("/api/user-avatars/{id}", userAvatar.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserAvatar> userAvatarList = userAvatarRepository.findAll();
        assertThat(userAvatarList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
