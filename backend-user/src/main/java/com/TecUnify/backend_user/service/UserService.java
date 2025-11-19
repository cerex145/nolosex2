package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.UserDTO;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    // ==========================
    //  AUTH GOOGLE (ya tenías)
    // ==========================
    public User findOrCreateGoogleUser(String googleId, String email, String firstName, String lastName) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            if (user.getGoogleId() == null || user.getGoogleId().isEmpty()) {
                user.setGoogleId(googleId);
                userRepository.save(user);
            }
            return user;
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setGoogleId(googleId);
        newUser.setFirstName(firstName != null ? firstName : "");
        newUser.setLastName(lastName != null ? lastName : "");
        newUser.setRole(com.TecUnify.backend_user.model.Role.USER);
        newUser.setActive(true);

        return userRepository.save(newUser);
    }

    // ==========================
    //  CRUD PARA UserController
    // ==========================

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserDTO::fromEntity)
                .orElse(null);
    }

    public UserDTO updateUser(Long id, User details) {

        return userRepository.findById(id).map(user -> {
            // Actualizar datos permitidos
            user.setFirstName(details.getFirstName());
            user.setLastName(details.getLastName());
            user.setPhone(details.getPhone());
            user.setActive(details.getActive());
            user.setRole(details.getRole());

            return UserDTO.fromEntity(userRepository.save(user));
        }).orElse(null);
    }

    public void deleteUser(Long id) {
        userRepository.findById(id).ifPresent(userRepository::delete);
    }

    // ==========================
    //  Extras
    // ==========================

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
