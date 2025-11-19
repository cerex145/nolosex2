package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.dto.EspacioDTO;
import com.TecUnify.backend_user.model.Espacio;
import com.TecUnify.backend_user.repository.EspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class EspacioService {

    private final EspacioRepository espacioRepository;

    // Obtener todos los espacios activos
    public List<EspacioDTO> getAllActivos() {
        return espacioRepository.findByActivoTrue().stream()
                .map(EspacioDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Obtener un espacio por ID
    public EspacioDTO getById(Long id) {
        return espacioRepository.findById(id)
                .map(EspacioDTO::fromEntity)
                .orElse(null);
    }

    // Crear un espacio
    public Espacio create(EspacioDTO dto) {
        Espacio espacio = dto.toEntity();
        espacio.setActivo(true);
        return espacioRepository.save(espacio);
    }

    // Actualizar un espacio
    public Espacio update(Long id, EspacioDTO dto) {
        return espacioRepository.findById(id).map(e -> {
            e.setNombre(dto.getNombre());
            e.setDescripcion(dto.getDescripcion());
            e.setCapacidad(dto.getCapacidad());
            e.setActivo(dto.getActivo());
            e.setImagenUrl(dto.getImagenUrl());
            return espacioRepository.save(e);
        }).orElse(null);
    }

    // Eliminar (soft delete)
    public void delete(Long id) {
        espacioRepository.findById(id).ifPresent(e -> {
            e.setActivo(false);
            espacioRepository.save(e);
        });
    }

    // Guardar imagen (URL)
    public Espacio updateImagen(Long id, String imagenUrl) {
        return espacioRepository.findById(id).map(e -> {
            e.setImagenUrl(imagenUrl);
            return espacioRepository.save(e);
        }).orElse(null);
    }
}
