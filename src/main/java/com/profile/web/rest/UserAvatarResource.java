package com.profile.web.rest;

import com.profile.domain.UserAvatar;
import com.profile.repository.UserAvatarRepository;
import com.profile.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.profile.domain.UserAvatar}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserAvatarResource {

    private final Logger log = LoggerFactory.getLogger(UserAvatarResource.class);

    private static final String ENTITY_NAME = "userAvatar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserAvatarRepository userAvatarRepository;

    public UserAvatarResource(UserAvatarRepository userAvatarRepository) {
        this.userAvatarRepository = userAvatarRepository;
    }

    /**
     * {@code POST  /user-avatars} : Create a new userAvatar.
     *
     * @param userAvatar the userAvatar to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userAvatar, or with status {@code 400 (Bad Request)} if the userAvatar has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-avatars")
    public ResponseEntity<UserAvatar> createUserAvatar(@Valid @RequestBody UserAvatar userAvatar) throws URISyntaxException {
        log.debug("REST request to save UserAvatar : {}", userAvatar);
        if (userAvatar.getId() != null) {
            throw new BadRequestAlertException("A new userAvatar cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserAvatar result = userAvatarRepository.save(userAvatar);
        return ResponseEntity.created(new URI("/api/user-avatars/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-avatars} : Updates an existing userAvatar.
     *
     * @param userAvatar the userAvatar to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userAvatar,
     * or with status {@code 400 (Bad Request)} if the userAvatar is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userAvatar couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-avatars")
    public ResponseEntity<UserAvatar> updateUserAvatar(@Valid @RequestBody UserAvatar userAvatar) throws URISyntaxException {
        log.debug("REST request to update UserAvatar : {}", userAvatar);
        if (userAvatar.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserAvatar result = userAvatarRepository.save(userAvatar);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userAvatar.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /user-avatars} : get all the userAvatars.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userAvatars in body.
     */
    @GetMapping("/user-avatars")
    public List<UserAvatar> getAllUserAvatars() {
        log.debug("REST request to get all UserAvatars");
        return userAvatarRepository.findAll();
    }

    /**
     * {@code GET  /user-avatars/:id} : get the "id" userAvatar.
     *
     * @param id the id of the userAvatar to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userAvatar, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-avatars/{id}")
    public ResponseEntity<UserAvatar> getUserAvatar(@PathVariable Long id) {
        log.debug("REST request to get UserAvatar : {}", id);
        Optional<UserAvatar> userAvatar = userAvatarRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userAvatar);
    }

    /**
     * {@code DELETE  /user-avatars/:id} : delete the "id" userAvatar.
     *
     * @param id the id of the userAvatar to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-avatars/{id}")
    public ResponseEntity<Void> deleteUserAvatar(@PathVariable Long id) {
        log.debug("REST request to delete UserAvatar : {}", id);
        userAvatarRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
