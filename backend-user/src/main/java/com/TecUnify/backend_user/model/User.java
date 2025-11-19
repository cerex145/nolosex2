package com.TecUnify.backend_user.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad de JPA que representa la tabla 'usuarios' en la base de datos.
 * Utiliza Lombok para reducir el boilerplate (constructores, getters/setters).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String password; // NOTA: En un entorno real, esta contraseña NUNCA debe guardarse sin cifrar.

    @Column(name = "nombre", nullable = false)
    private String firstName;

    @Column(name = "apellido", nullable = false)
    private String lastName;

    @Column(name = "telefono")
    private String phone;

    // El campo Role usa la clase Role (Enum) que también debe existir.
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "activo")
    @Default
    private Boolean active = true;

    @Column(name = "google_id", unique = true)
    private String googleId; // Para Google OAuth
}
