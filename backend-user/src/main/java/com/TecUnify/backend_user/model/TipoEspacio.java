package com.TecUnify.backend_user.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "tipos_espacios")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoEspacio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 50)
    private String icono;

    @Builder.Default
    private Boolean activo = true;

    @OneToMany(mappedBy = "tipoEspacio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Espacio> espacios;
}