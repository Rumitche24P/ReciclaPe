package com.reciclape.reporte_service.repository;

import com.reciclape.reporte_service.entity.ImpactoEvento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImpactoEventoRepository extends JpaRepository<ImpactoEvento, Long> {
    boolean existsByRecojoId(Long recojoId);
    List<ImpactoEvento> findByVecinoId(Long vecinoId);
}
