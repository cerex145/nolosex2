package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.ReservaDTO;
import com.TecUnify.backend_user.model.Reserva;
import com.TecUnify.backend_user.model.User;
import com.TecUnify.backend_user.service.ReservaService;
import com.TecUnify.backend_user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    private final ReservaService reservaService;
    private final UserService userService;

    // Usuario: ver solo sus reservas
    @GetMapping("/mi")
    public ResponseEntity<?> misMisReservas(@RequestParam("email") String email) {
        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("Usuario no encontrado");
        
        List<ReservaDTO> reservas = reservaService.getByUserId(user.getId());
        return ResponseEntity.ok(reservas);
    }

    // Admin: ver todas
    @GetMapping
    public ResponseEntity<?> listarTodas(@RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Solo administradores");
        }
        List<ReservaDTO> list = reservaService.getAll();
        return ResponseEntity.ok(list);
    }

    // Usuario: crear reserva
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ReservaDTO dto, @RequestParam("email") String email) {
        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("Usuario no encontrado");
        
        dto.setUserId(user.getId());
        Reserva r = reservaService.create(dto);
        return ResponseEntity.status(201).body(r);
    }

    // Usuario: cancelar propia reserva
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Long id, @RequestParam("email") String email) {
        User user = userService.findByEmail(email);
        if (user == null) return ResponseEntity.status(404).body("Usuario no encontrado");

        Reserva r = reservaService.getById(id);
        if (r == null) return ResponseEntity.status(404).body("Reserva no encontrada");
        if (!r.getUsuario().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("No puedes cancelar esta reserva");
        }

        reservaService.delete(id);
        return ResponseEntity.ok("Cancelada");
    }

    // Admin: cambiar estado de reserva
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam("estado") String estado,
                                           @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Solo administradores");
        }
        Reserva r = reservaService.updateEstado(id, estado);
        return r != null ? ResponseEntity.ok(r) : ResponseEntity.status(404).body("No encontrada");
    }
}