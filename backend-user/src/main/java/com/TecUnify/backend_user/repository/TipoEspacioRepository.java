package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.TipoEspacio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TipoEspacioRepository extends JpaRepository<TipoEspacio, Long> {
    List<TipoEspacio> findByActivoTrue();
}
