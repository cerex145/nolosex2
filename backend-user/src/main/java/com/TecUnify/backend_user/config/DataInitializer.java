package com.TecUnify.backend_user.config;

import com.TecUnify.backend_user.model.*;
import com.TecUnify.backend_user.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TipoEspacioRepository tipoEspacioRepository;
    private final MotivoReservaRepository motivoReservaRepository;
    private final UserRepository userRepository;
    private final EspacioRepository espacioRepository;
    private final HorarioDisponibilidadRepository horarioDisponibilidadRepository;
    private final ReservaRepository reservaRepository;

    @Override
    public void run(String... args) throws Exception {
        // Solo inicializar si no hay datos
        if (tipoEspacioRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Crear tipos de espacios
        TipoEspacio laboratorio = TipoEspacio.builder()
                .nombre("Laboratorio")
                .descripcion("Espacios equipados con computadoras y tecnología para clases prácticas")
                .icono("wrench")
                .activo(true)
                .build();

        TipoEspacio canchaDeportiva = TipoEspacio.builder()
                .nombre("Cancha Deportiva")
                .descripcion("Espacios deportivos para actividades físicas y deportes")
                .icono("dumbbell")
                .activo(true)
                .build();

        TipoEspacio salaEstudio = TipoEspacio.builder()
                .nombre("Sala de Estudio")
                .descripcion("Espacios silenciosos para estudio individual y grupal")
                .icono("book-open")
                .activo(true)
                .build();

        TipoEspacio auditorio = TipoEspacio.builder()
                .nombre("Auditorio")
                .descripcion("Espacios grandes para eventos, conferencias y presentaciones")
                .icono("users")
                .activo(true)
                .build();

        tipoEspacioRepository.saveAll(Arrays.asList(laboratorio, canchaDeportiva, salaEstudio, auditorio));

        // Crear motivos de reserva
        MotivoReserva claseAcademica = MotivoReserva.builder()
                .nombre("Clase Académica")
                .descripcion("Reserva para clases regulares del programa académico")
                .activo(true)
                .build();

        MotivoReserva proyectoInvestigacion = MotivoReserva.builder()
                .nombre("Proyecto de Investigación")
                .descripcion("Reserva para trabajos de investigación y tesis")
                .activo(true)
                .build();

        MotivoReserva estudioGrupal = MotivoReserva.builder()
                .nombre("Estudio Grupal")
                .descripcion("Reserva para sesiones de estudio en grupo")
                .activo(true)
                .build();

        MotivoReserva deporte = MotivoReserva.builder()
                .nombre("Deporte")
                .descripcion("Reserva para actividades deportivas y físicas")
                .activo(true)
                .build();

        motivoReservaRepository.saveAll(Arrays.asList(claseAcademica, proyectoInvestigacion, estudioGrupal, deporte));

        // Crear usuarios
        User admin = User.builder()
                .email("admin@tecunify.com")
                .firstName("Administrador")
                .lastName("Sistema")
                .phone("999999999")
                .role(Role.ADMIN)
                .active(true)
                .build();

        User estudiante1 = User.builder()
                .email("estudiante1@tecunify.com")
                .firstName("Juan")
                .lastName("Pérez")
                .phone("987654321")
                .role(Role.USER)
                .active(true)
                .build();

        User estudiante2 = User.builder()
                .email("estudiante2@tecunify.com")
                .firstName("María")
                .lastName("González")
                .phone("987654322")
                .role(Role.USER)
                .active(true)
                .build();

        userRepository.saveAll(Arrays.asList(admin, estudiante1, estudiante2));

        // Crear espacios
        Espacio labComputacion = Espacio.builder()
                .nombre("Laboratorio de Computación A")
                .descripcion("Laboratorio equipado con 30 computadoras de última generación")
                .ubicacion("Campus Norte - Edificio A - Piso 2")
                .capacidad(30)
                .tipoEspacio(laboratorio)
                .precioPorHora(new BigDecimal("50.00"))
                .equipamiento("30 PCs, Proyector 4K, WiFi, Aire acondicionado")
                .activo(true)
                .build();

        Espacio canchaFutbol = Espacio.builder()
                .nombre("Cancha de Fútbol 1")
                .descripcion("Cancha de fútbol reglamentaria con césped artificial")
                .ubicacion("Campus Norte - Zona Deportiva")
                .capacidad(22)
                .tipoEspacio(canchaDeportiva)
                .precioPorHora(new BigDecimal("40.00"))
                .equipamiento("Porterías, Iluminación nocturna, Vestuarios")
                .activo(true)
                .build();

        Espacio salaEstudioSilenciosa = Espacio.builder()
                .nombre("Sala de Estudio Silenciosa")
                .descripcion("Sala para estudio individual con ambiente silencioso")
                .ubicacion("Campus Norte - Biblioteca - Piso 3")
                .capacidad(15)
                .tipoEspacio(salaEstudio)
                .precioPorHora(new BigDecimal("20.00"))
                .equipamiento("Mesa individual, Luz LED, WiFi, Silencio")
                .activo(true)
                .build();

        Espacio auditorioPrincipal = Espacio.builder()
                .nombre("Auditorio Principal")
                .descripcion("Auditorio principal para eventos grandes")
                .ubicacion("Campus Norte - Edificio Central")
                .capacidad(200)
                .tipoEspacio(auditorio)
                .precioPorHora(new BigDecimal("100.00"))
                .equipamiento("Sistema de sonido, Proyector 4K, Escenario, Aire acondicionado")
                .activo(true)
                .build();

        espacioRepository.saveAll(Arrays.asList(labComputacion, canchaFutbol, salaEstudioSilenciosa, auditorioPrincipal));

        // Crear horarios de disponibilidad
        // Laboratorio (Lunes a Viernes 8:00-22:00, Sábado 8:00-18:00)
        for (int dia = 1; dia <= 5; dia++) { // Lunes a Viernes
            HorarioDisponibilidad horario = HorarioDisponibilidad.builder()
                    .espacio(labComputacion)
                    .diaSemana(dia)
                    .horaInicio(LocalTime.of(8, 0))
                    .horaFin(LocalTime.of(22, 0))
                    .activo(true)
                    .build();
            horarioDisponibilidadRepository.save(horario);
        }
        
        // Sábado
        HorarioDisponibilidad horarioSabado = HorarioDisponibilidad.builder()
                .espacio(labComputacion)
                .diaSemana(6)
                .horaInicio(LocalTime.of(8, 0))
                .horaFin(LocalTime.of(18, 0))
                .activo(true)
                .build();
        horarioDisponibilidadRepository.save(horarioSabado);

        // Cancha (Todos los días 6:00-22:00)
        for (int dia = 0; dia <= 6; dia++) {
            HorarioDisponibilidad horario = HorarioDisponibilidad.builder()
                    .espacio(canchaFutbol)
                    .diaSemana(dia)
                    .horaInicio(LocalTime.of(6, 0))
                    .horaFin(LocalTime.of(22, 0))
                    .activo(true)
                    .build();
            horarioDisponibilidadRepository.save(horario);
        }

        // Sala de Estudio (Todos los días 6:00-23:00)
        for (int dia = 0; dia <= 6; dia++) {
            HorarioDisponibilidad horario = HorarioDisponibilidad.builder()
                    .espacio(salaEstudioSilenciosa)
                    .diaSemana(dia)
                    .horaInicio(LocalTime.of(6, 0))
                    .horaFin(LocalTime.of(23, 0))
                    .activo(true)
                    .build();
            horarioDisponibilidadRepository.save(horario);
        }

        // Auditorio (Lunes a Viernes 8:00-20:00)
        for (int dia = 1; dia <= 5; dia++) {
            HorarioDisponibilidad horario = HorarioDisponibilidad.builder()
                    .espacio(auditorioPrincipal)
                    .diaSemana(dia)
                    .horaInicio(LocalTime.of(8, 0))
                    .horaFin(LocalTime.of(20, 0))
                    .activo(true)
                    .build();
            horarioDisponibilidadRepository.save(horario);
        }

        // Crear algunas reservas de ejemplo
        Reserva reserva1 = Reserva.builder()
                .usuario(estudiante1)
                .espacio(labComputacion)
                .fechaReserva(LocalDate.now().plusDays(1))
                .horaInicio(LocalTime.of(9, 0))
                .horaFin(LocalTime.of(11, 0))
                .motivo("Clase Académica")
                .estado(EstadoReserva.CONFIRMADA)
                .precioTotal(new BigDecimal("100.00"))
                .build();

        Reserva reserva2 = Reserva.builder()
                .usuario(estudiante2)
                .espacio(canchaFutbol)
                .fechaReserva(LocalDate.now().plusDays(2))
                .horaInicio(LocalTime.of(14, 0))
                .horaFin(LocalTime.of(16, 0))
                .motivo("Deporte")
                .estado(EstadoReserva.PENDIENTE)
                .precioTotal(new BigDecimal("80.00"))
                .build();

        reservaRepository.saveAll(Arrays.asList(reserva1, reserva2));

        System.out.println("✅ Datos iniciales creados exitosamente!");
        System.out.println("📊 Resumen:");
        System.out.println("   - Tipos de espacios: " + tipoEspacioRepository.count());
        System.out.println("   - Motivos de reserva: " + motivoReservaRepository.count());
        System.out.println("   - Usuarios: " + userRepository.count());
        System.out.println("   - Espacios: " + espacioRepository.count());
        System.out.println("   - Horarios: " + horarioDisponibilidadRepository.count());
        System.out.println("   - Reservas: " + reservaRepository.count());
    }
}