package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.model.MotivoReserva;
import com.TecUnify.backend_user.repository.MotivoReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MotivoReservaService {
    private final MotivoReservaRepository motivoReservaRepository;

    public List<MotivoReserva> getAllMotivosActivos() {
        return motivoReservaRepository.findByActivoTrue();
    }

    public MotivoReserva getMotivoById(Long id) {
        return motivoReservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Motivo de reserva no encontrado"));
    }
}
