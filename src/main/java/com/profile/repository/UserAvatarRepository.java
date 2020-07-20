package com.profile.repository;

import com.profile.domain.UserAvatar;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UserAvatar entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserAvatarRepository extends JpaRepository<UserAvatar, Long> {
}
