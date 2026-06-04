package com.reciclape.recojo_service.repository;

import com.reciclape.recojo_service.entity.PuntoAcopio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PuntoAcopioRepository extends JpaRepository<PuntoAcopio, Long> {
    List<PuntoAcopio> findByVecinoId(Long vecinoId);
    List<PuntoAcopio> findByActivoTrue();
}
