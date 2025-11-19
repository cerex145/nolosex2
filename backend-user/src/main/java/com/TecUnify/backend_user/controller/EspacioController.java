package com.TecUnify.backend_user.controller;

import com.TecUnify.backend_user.dto.EspacioDTO;
import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.service.EspacioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/espacios")
@CrossOrigin(origins = "*")
public class EspacioController {

    private final EspacioService espacioService;

    @GetMapping
    public ResponseEntity<List<EspacioDTO>> listar() {
        return ResponseEntity.ok(espacioService.getAllActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        EspacioDTO dto = espacioService.getById(id);
        return dto != null ? ResponseEntity.ok(dto)
                : ResponseEntity.status(404).body("Espacio no encontrado");
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody EspacioDTO dto,
                                   @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        return ResponseEntity.status(201).body(espacioService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody EspacioDTO dto,
                                        @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        Espacio espacio = espacioService.update(id, dto);
        return espacio != null ? ResponseEntity.ok(espacio)
                : ResponseEntity.status(404).body("Espacio no encontrado");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
                                      @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        espacioService.delete(id);
        return ResponseEntity.ok("Eliminado");
    }

    // Imagen
    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("X-User-Role") String role) {

        if (!"ADMIN".equals(role))
            return ResponseEntity.status(403).body("Solo administradores");

        // por ahora solo guardamos un link fake
        String fakeUrl = "https://fake-storage.com/" + file.getOriginalFilename();

        Espacio e = espacioService.updateImagen(id, fakeUrl);

        return e != null ? ResponseEntity.ok("Imagen actualizada")
                : ResponseEntity.status(404).body("Espacio no encontrado");
    }
}
