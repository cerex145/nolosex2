package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.Espacio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EspacioRepository extends JpaRepository<Espacio, Long> {

    List<Espacio> findByActivoTrue();
}
