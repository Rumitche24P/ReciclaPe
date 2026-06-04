package com.reciclape.recojo_service.repository;

import com.reciclape.recojo_service.entity.EstadoRecojo;
import com.reciclape.recojo_service.entity.Recojo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecojoRepository extends JpaRepository<Recojo, Long> {
    List<Recojo> findByEstado(EstadoRecojo estado);
    List<Recojo> findByVecinoId(Long vecinoId);
    List<Recojo> findByRecicladorId(Long recicladorId);
}
