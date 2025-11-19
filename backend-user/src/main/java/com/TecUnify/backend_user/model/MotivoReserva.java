package com.TecUnify.backend_user.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "motivos_reserva")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MotivoReserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Builder.Default
    private Boolean activo = true;
}
