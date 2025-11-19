package com.TecUnify.backend_user.dto;

import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.model.EstadoReserva;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservaDTO {

    private Long id;
    private Long userId;
    private Long espacioId;

    private LocalDate fechaReserva;
    private LocalTime horaInicio;
    private LocalTime horaFin;

    private String motivo;
    private String estado;
    private String observaciones;

    private Double precioTotal;

    public static ReservaDTO fromEntity(Reserva r) {
        ReservaDTO dto = new ReservaDTO();
        dto.setId(r.getId());
        dto.setUserId(r.getUsuario().getId());
        dto.setEspacioId(r.getEspacio().getId());
        dto.setFechaReserva(r.getFechaReserva());
        dto.setHoraInicio(r.getHoraInicio());
        dto.setHoraFin(r.getHoraFin());
        dto.setMotivo(r.getMotivo());
        dto.setEstado(r.getEstado().name());  // ✔ ENUM → String
        dto.setObservaciones(r.getObservaciones());
        dto.setPrecioTotal(
                r.getPrecioTotal() != null ? r.getPrecioTotal().doubleValue() : null
        );
        return dto;
    }
}
