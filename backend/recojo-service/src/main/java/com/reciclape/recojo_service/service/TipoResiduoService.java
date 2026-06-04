package com.reciclape.recojo_service.service;

import com.reciclape.recojo_service.dto.TipoResiduoCrearDTO;
import com.reciclape.recojo_service.dto.TipoResiduoDTO;
import com.reciclape.recojo_service.entity.TipoResiduo;
import com.reciclape.recojo_service.exception.ApiExceptions;
import com.reciclape.recojo_service.repository.TipoResiduoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TipoResiduoService {

    private final TipoResiduoRepository repository;

    public TipoResiduoService(TipoResiduoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<TipoResiduoDTO> listar() {
        return repository.findAll().stream().map(TipoResiduoDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public TipoResiduoDTO obtener(Long id) {
        return repository.findById(id).map(TipoResiduoDTO::from)
                .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado("Tipo de residuo no encontrado: " + id));
    }

    @Transactional
    public TipoResiduoDTO crear(TipoResiduoCrearDTO dto) {
        if (repository.existsByNombreIgnoreCase(dto.nombre())) {
            throw new ApiExceptions.ReglaNegocio("Ya existe un tipo de residuo con ese nombre");
        }
        TipoResiduo t = new TipoResiduo();
        t.setNombre(dto.nombre());
        t.setDescripcion(dto.descripcion());
        t.setFactorCo2Kg(dto.factorCo2Kg());
        t.setPrecioKg(dto.precioKg() != null ? dto.precioKg() : BigDecimal.ZERO);
        t.setActivo(true);
        return TipoResiduoDTO.from(repository.save(t));
    }

    @Transactional
    public TipoResiduoDTO actualizar(Long id, TipoResiduoCrearDTO dto) {
        TipoResiduo t = repository.findById(id)
                .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado("Tipo de residuo no encontrado: " + id));
        t.setNombre(dto.nombre());
        t.setDescripcion(dto.descripcion());
        t.setFactorCo2Kg(dto.factorCo2Kg());
        if (dto.precioKg() != null) {
            t.setPrecioKg(dto.precioKg());
        }
        return TipoResiduoDTO.from(repository.save(t));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new ApiExceptions.RecursoNoEncontrado("Tipo de residuo no encontrado: " + id);
        }
        repository.deleteById(id);
    }
}
