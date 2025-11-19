package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.model.TipoEspacio;
import com.TecUnify.backend_user.service.TipoEspacioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-espacios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class TipoEspacioController {
    private final TipoEspacioService tipoEspacioService;

    @GetMapping
    public ResponseEntity<List<TipoEspacio>> getAllTipos() {
        try {
            List<TipoEspacio> tipos = tipoEspacioService.getAllTiposActivos();
            return ResponseEntity.ok(tipos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoEspacio> getTipoById(@PathVariable Long id) {
        try {
            TipoEspacio tipo = tipoEspacioService.getTipoById(id);
            return ResponseEntity.ok(tipo);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
