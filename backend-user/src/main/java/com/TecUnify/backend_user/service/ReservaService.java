package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.ReservaDTO;
import com.TecUnify.backend_user.model.*;
import com.TecUnify.backend_user.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UserRepository userRepository;
    private final EspacioRepository espacioRepository;

    public List<ReservaDTO> getByUserId(Long userId) {
        return reservaRepository.findByUsuarioId(userId)
                .stream()
                .map(ReservaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ReservaDTO> getAll() {
        return reservaRepository.findAll()
                .stream()
                .map(ReservaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Reserva create(ReservaDTO dto) {

        User user = userRepository.findById(dto.getUserId()).orElse(null);
        Espacio espacio = espacioRepository.findById(dto.getEspacioId()).orElse(null);
        if (user == null || espacio == null) return null;

        Reserva r = new Reserva();
        r.setUsuario(user);
        r.setEspacio(espacio);
        r.setFechaReserva(dto.getFechaReserva());
        r.setHoraInicio(dto.getHoraInicio());
        r.setHoraFin(dto.getHoraFin());
        r.setMotivo(dto.getMotivo());
        r.setObservaciones(dto.getObservaciones());

        // ✔ Estado siempre inicia en PENDIENTE
        r.setEstado(EstadoReserva.PENDIENTE);

        // Precio
        if (dto.getPrecioTotal() != null) {
            r.setPrecioTotal(BigDecimal.valueOf(dto.getPrecioTotal()));
        }

        return reservaRepository.save(r);
    }

    public Reserva getById(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        reservaRepository.deleteById(id);
    }
    public void cancelarReserva(Long id) {
        Reserva r = reservaRepository.findById(id).orElse(null);
        if (r == null) return;

        r.setEstado(EstadoReserva.CANCELADA);  // ← usa tu ENUM
        reservaRepository.save(r);
    }


    // ============================
    // CAMBIAR ESTADO (ADMIN)
    // ============================
    public Reserva updateEstado(Long id, String estado) {

        Reserva r = reservaRepository.findById(id).orElse(null);
        if (r == null) return null;

        try {
            EstadoReserva nuevo = EstadoReserva.valueOf(estado.toUpperCase());  // ✔ String → ENUM
            r.setEstado(nuevo);
        } catch (IllegalArgumentException e) {
            return null; // Estado inválido
        }

        return reservaRepository.save(r);
    }
}
