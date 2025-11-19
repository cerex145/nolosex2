package com.TecUnify.backend_user.dto;

import com.TecUnify.backend_user.model.Espacio;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EspacioDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private Integer capacidad;
    private Boolean activo;
    private String imagenUrl;

    public static EspacioDTO fromEntity(Espacio e) {
        return EspacioDTO.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .descripcion(e.getDescripcion())
                .capacidad(e.getCapacidad())
                .activo(e.getActivo())
                .imagenUrl(e.getImagenUrl())
                .build();
    }

    public Espacio toEntity() {
        Espacio e = new Espacio();
        e.setId(this.id);
        e.setNombre(this.nombre);
        e.setDescripcion(this.descripcion);
        e.setCapacidad(this.capacidad);
        e.setActivo(this.activo != null ? this.activo : true);
        e.setImagenUrl(this.imagenUrl);
        return e;
    }
}
