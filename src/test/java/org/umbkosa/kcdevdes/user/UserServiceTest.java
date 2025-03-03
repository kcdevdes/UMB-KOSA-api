package org.umbkosa.kcdevdes.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        user = new UserEntity();
        user.setUsername("testUser");
        user.setEmail("test@test.com");
        user.setProfileImageUrl("test.jpg");
        user.setRole(UserRole.USER);
        user.setStatus(UserStatus.ACTIVE);
    }

    @Test
    void findUserById_Success() {
        when(userRepository.findById(any())).thenReturn(java.util.Optional.of(user));

        Optional<UserEntity> foundUser = userService.getUserById(user.getId());

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get()).isEqualTo(user);

        verify(userRepository, times(1)).findById(user.getId());
    }

    @Test
    void findAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<UserEntity> users = userService.findAll();

        assertThat(users).contains(user);
        assertThat(users).hasSize(1);
        assertThat(users.get(0)).isEqualTo(user);

        verify(userRepository, times(1)).findAll();
    }

}