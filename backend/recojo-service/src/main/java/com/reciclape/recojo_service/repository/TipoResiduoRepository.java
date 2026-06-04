package com.reciclape.recojo_service.repository;

import com.reciclape.recojo_service.entity.TipoResiduo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoResiduoRepository extends JpaRepository<TipoResiduo, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
    Optional<TipoResiduo> findByNombreIgnoreCase(String nombre);
}
