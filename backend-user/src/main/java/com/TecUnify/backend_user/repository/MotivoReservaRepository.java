package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.MotivoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MotivoReservaRepository extends JpaRepository<MotivoReserva, Long> {
    List<MotivoReserva> findByActivoTrue();
}
