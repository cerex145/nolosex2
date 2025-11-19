package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.model.MotivoReserva;
import com.TecUnify.backend_user.service.MotivoReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motivos-reserva")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class MotivoReservaController {
    private final MotivoReservaService motivoReservaService;

    @GetMapping
    public ResponseEntity<List<MotivoReserva>> getAllMotivos() {
        try {
            List<MotivoReserva> motivos = motivoReservaService.getAllMotivosActivos();
            return ResponseEntity.ok(motivos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MotivoReserva> getMotivoById(@PathVariable Long id) {
        try {
            MotivoReserva motivo = motivoReservaService.getMotivoById(id);
            return ResponseEntity.ok(motivo);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
