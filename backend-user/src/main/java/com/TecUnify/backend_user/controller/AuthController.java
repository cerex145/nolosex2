package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.AuthResponse;
import com.TecUnify.backend_user.dto.UserDTO;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {

    private final UserService userService;

    @Data
    public static class GoogleAuthRequest {
        private String googleId;
        private String email;
        private String firstName;
        private String lastName;
        private String picture;
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody GoogleAuthRequest request) {
        try {
            // Validar email @tecsup.edu.pe
            if (request.getEmail() == null || !request.getEmail().endsWith("@tecsup.edu.pe")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new AuthResponse(null, null, "Solo se permite correo @tecsup.edu.pe"));
            }

            // Buscar o crear usuario
            User user = userService.findOrCreateGoogleUser(
                    request.getGoogleId(),
                    request.getEmail(),
                    request.getFirstName(),
                    request.getLastName()
            );

            UserDTO userDto = UserDTO.fromEntity(user);
            AuthResponse resp = new AuthResponse(null, userDto, "Autenticado con Google");

            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse(null, null, "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validate(@RequestParam("email") String email) {
        try {
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado");
            }
            return ResponseEntity.ok(UserDTO.fromEntity(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam("email") String email) {
        try {
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Usuario no encontrado");
            }
            return ResponseEntity.ok(UserDTO.fromEntity(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}