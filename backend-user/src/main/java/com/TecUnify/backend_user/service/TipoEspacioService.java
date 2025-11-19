package com.TecUnify.backend_user.service;

import com.TecUnify.backend_user.model.TipoEspacio;
import com.TecUnify.backend_user.repository.TipoEspacioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoEspacioService {
    private final TipoEspacioRepository tipoEspacioRepository;

    public List<TipoEspacio> getAllTiposActivos() {
        return tipoEspacioRepository.findByActivoTrue();
    }

    public TipoEspacio getTipoById(Long id) {
        return tipoEspacioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de espacio no encontrado"));
    }
}
