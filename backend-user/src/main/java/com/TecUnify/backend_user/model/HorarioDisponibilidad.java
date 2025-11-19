package com.TecUnify.backend_user.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "horarios_disponibilidad")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HorarioDisponibilidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "espacio_id", nullable = false)
    private Espacio espacio;

    @Column(name = "dia_semana", nullable = false)
    private Integer diaSemana; // 0=Domingo, 1=Lunes, etc.

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Builder.Default
    private Boolean activo = true;
}
