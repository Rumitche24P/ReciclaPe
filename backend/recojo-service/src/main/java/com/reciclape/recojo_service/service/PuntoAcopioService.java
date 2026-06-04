package com.reciclape.recojo_service.service;

import com.reciclape.recojo_service.dto.PuntoAcopioCrearDTO;
import com.reciclape.recojo_service.dto.PuntoAcopioDTO;
import com.reciclape.recojo_service.entity.PuntoAcopio;
import com.reciclape.recojo_service.exception.ApiExceptions;
import com.reciclape.recojo_service.repository.PuntoAcopioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PuntoAcopioService {

    private final PuntoAcopioRepository repository;

    public PuntoAcopioService(PuntoAcopioRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<PuntoAcopioDTO> listar(Long vecinoId) {
        List<PuntoAcopio> puntos = (vecinoId != null)
                ? repository.findByVecinoId(vecinoId)
                : repository.findAll();
        return puntos.stream().map(PuntoAcopioDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public PuntoAcopioDTO obtener(Long id) {
        return repository.findById(id).map(PuntoAcopioDTO::from)
                .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado("Punto de acopio no encontrado: " + id));
    }

    @Transactional
    public PuntoAcopioDTO crear(PuntoAcopioCrearDTO dto) {
        PuntoAcopio p = new PuntoAcopio();
        aplicar(p, dto);
        p.setActivo(true);
        return PuntoAcopioDTO.from(repository.save(p));
    }

    @Transactional
    public PuntoAcopioDTO actualizar(Long id, PuntoAcopioCrearDTO dto) {
        PuntoAcopio p = repository.findById(id)
                .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado("Punto de acopio no encontrado: " + id));
        aplicar(p, dto);
        return PuntoAcopioDTO.from(repository.save(p));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new ApiExceptions.RecursoNoEncontrado("Punto de acopio no encontrado: " + id);
        }
        repository.deleteById(id);
    }

    private void aplicar(PuntoAcopio p, PuntoAcopioCrearDTO dto) {
        p.setVecinoId(dto.vecinoId());
        p.setDireccion(dto.direccion());
        p.setDistrito(dto.distrito());
        p.setReferencia(dto.referencia());
        p.setLatitud(dto.latitud());
        p.setLongitud(dto.longitud());
    }
}
