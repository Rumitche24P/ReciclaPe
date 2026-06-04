package com.reciclape.recojo_service.service;

import com.reciclape.recojo_service.dto.AceptarRecojoDTO;
import com.reciclape.recojo_service.dto.CompletarRecojoDTO;
import com.reciclape.recojo_service.dto.RecojoCrearDTO;
import com.reciclape.recojo_service.dto.RecojoResponseDTO;
import com.reciclape.recojo_service.entity.*;
import com.reciclape.recojo_service.exception.ApiExceptions;
import com.reciclape.recojo_service.messaging.RecojoCompletadoEvento;
import com.reciclape.recojo_service.messaging.RecojoEventPublisher;
import com.reciclape.recojo_service.repository.PuntoAcopioRepository;
import com.reciclape.recojo_service.repository.RecojoRepository;
import com.reciclape.recojo_service.repository.TipoResiduoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecojoService {

    private final RecojoRepository recojoRepository;
    private final PuntoAcopioRepository puntoAcopioRepository;
    private final TipoResiduoRepository tipoResiduoRepository;
    private final RecojoEventPublisher eventPublisher;

    public RecojoService(RecojoRepository recojoRepository, PuntoAcopioRepository puntoAcopioRepository,
                         TipoResiduoRepository tipoResiduoRepository, RecojoEventPublisher eventPublisher) {
        this.recojoRepository = recojoRepository;
        this.puntoAcopioRepository = puntoAcopioRepository;
        this.tipoResiduoRepository = tipoResiduoRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<RecojoResponseDTO> listar(EstadoRecojo estado, Long vecinoId, Long recicladorId) {
        List<Recojo> recojos;
        if (estado != null) {
            recojos = recojoRepository.findByEstado(estado);
        } else if (vecinoId != null) {
            recojos = recojoRepository.findByVecinoId(vecinoId);
        } else if (recicladorId != null) {
            recojos = recojoRepository.findByRecicladorId(recicladorId);
        } else {
            recojos = recojoRepository.findAll();
        }
        return recojos.stream().map(RecojoResponseDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public RecojoResponseDTO obtener(Long id) {
        return RecojoResponseDTO.from(buscar(id));
    }

    @Transactional
    public RecojoResponseDTO crear(RecojoCrearDTO dto) {
        PuntoAcopio punto = puntoAcopioRepository.findById(dto.puntoAcopioId())
                .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado(
                        "Punto de acopio no encontrado: " + dto.puntoAcopioId()));

        Recojo recojo = new Recojo();
        recojo.setPuntoAcopio(punto);
        recojo.setVecinoId(dto.vecinoId());
        recojo.setObservacion(dto.observacion());
        recojo.setEstado(EstadoRecojo.SOLICITADO);
        return RecojoResponseDTO.from(recojoRepository.save(recojo));
    }

    @Transactional
    public RecojoResponseDTO aceptar(Long id, AceptarRecojoDTO dto) {
        Recojo recojo = buscar(id);
        if (recojo.getEstado() != EstadoRecojo.SOLICITADO) {
            throw new ApiExceptions.ReglaNegocio("Solo se puede aceptar un recojo en estado SOLICITADO");
        }
        recojo.setRecicladorId(dto.recicladorId());
        recojo.setEstado(EstadoRecojo.ACEPTADO);
        return RecojoResponseDTO.from(recojoRepository.save(recojo));
    }

    @Transactional
    public RecojoResponseDTO completar(Long id, CompletarRecojoDTO dto) {
        Recojo recojo = buscar(id);
        if (recojo.getEstado() != EstadoRecojo.ACEPTADO) {
            throw new ApiExceptions.ReglaNegocio("Solo se puede completar un recojo en estado ACEPTADO");
        }

        recojo.getDetalles().clear();
        for (CompletarRecojoDTO.DetalleCrearDTO d : dto.detalles()) {
            TipoResiduo tipo = tipoResiduoRepository.findById(d.tipoResiduoId())
                    .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado(
                            "Tipo de residuo no encontrado: " + d.tipoResiduoId()));
            DetalleRecojo detalle = new DetalleRecojo();
            detalle.setTipoResiduo(tipo);
            detalle.setKilogramos(d.kilogramos());
            // CO2 evitado = kilogramos * factor del tipo de residuo
            detalle.setCo2Evitado(d.kilogramos().multiply(tipo.getFactorCo2Kg()));
            recojo.agregarDetalle(detalle);
        }

        recojo.setEstado(EstadoRecojo.COMPLETADO);
        recojo.setFechaRecojo(LocalDateTime.now());
        Recojo guardado = recojoRepository.save(recojo);

        publicarEvento(guardado);
        return RecojoResponseDTO.from(guardado);
    }

    @Transactional
    public RecojoResponseDTO cancelar(Long id) {
        Recojo recojo = buscar(id);
        if (recojo.getEstado() == EstadoRecojo.COMPLETADO) {
            throw new ApiExceptions.ReglaNegocio("No se puede cancelar un recojo ya completado");
        }
        recojo.setEstado(EstadoRecojo.CANCELADO);
        return RecojoResponseDTO.from(recojoRepository.save(recojo));
    }

    private Recojo buscar(Long id) {
        return recojoRepository.findById(id)
                .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado("Recojo no encontrado: " + id));
    }

    private void publicarEvento(Recojo recojo) {
        BigDecimal kgTotal = recojo.getDetalles().stream()
                .map(DetalleRecojo::getKilogramos)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal co2Total = recojo.getDetalles().stream()
                .map(DetalleRecojo::getCo2Evitado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        eventPublisher.publicarRecojoCompletado(new RecojoCompletadoEvento(
                recojo.getId(),
                recojo.getVecinoId(),
                recojo.getRecicladorId(),
                recojo.getPuntoAcopio().getDistrito(),
                kgTotal,
                co2Total,
                recojo.getFechaRecojo()));
    }
}
