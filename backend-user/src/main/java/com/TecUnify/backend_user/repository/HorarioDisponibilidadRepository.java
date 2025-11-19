package com.TecUnify.backend_user.repository;

import com.TecUnify.backend_user.model.HorarioDisponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface HorarioDisponibilidadRepository extends JpaRepository<HorarioDisponibilidad, Long> {
    List<HorarioDisponibilidad> findByEspacioIdAndActivoTrue(Long espacioId);
    
    @Query("SELECT h FROM HorarioDisponibilidad h WHERE h.espacio.id = :espacioId " +
           "AND h.diaSemana = :diaSemana " +
           "AND h.activo = true " +
           "AND h.horaInicio <= :horaInicio " +
           "AND h.horaFin >= :horaFin")
    List<HorarioDisponibilidad> findAvailableHours(@Param("espacioId") Long espacioId,
                                                   @Param("diaSemana") Integer diaSemana,
                                                   @Param("horaInicio") LocalTime horaInicio,
                                                   @Param("horaFin") LocalTime horaFin);
}
