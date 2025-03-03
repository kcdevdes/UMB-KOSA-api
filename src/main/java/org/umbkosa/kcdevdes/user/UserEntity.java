package org.umbkosa.kcdevdes.user;

import jakarta.persistence.*;
import lombok.*;
import org.umbkosa.kcdevdes.base.BaseEntity;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "users")
@NoArgsConstructor
public class UserEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column
    private String bio;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(nullable = false)
    private String profileImageUrl = "https://example.com/default-profile.png";

    @Column
    private LocalDateTime deletedAt = null;
}

