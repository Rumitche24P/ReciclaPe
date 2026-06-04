package com.reciclape.recojo_service.dto;

import com.reciclape.recojo_service.entity.DetalleRecojo;
import com.reciclape.recojo_service.entity.Recojo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record RecojoResponseDTO(
        Long id,
        Long puntoAcopioId,
        String direccion,
        String distrito,
        Long vecinoId,
        Long recicladorId,
        String estado,
        LocalDateTime fechaSolicitud,
        LocalDateTime fechaRecojo,
        String observacion,
        List<DetalleResponseDTO> detalles,
        BigDecimal kgTotal,
        BigDecimal co2TotalEvitado
) {
    public record DetalleResponseDTO(
            Long tipoResiduoId,
            String tipoResiduo,
            BigDecimal kilogramos,
            BigDecimal co2Evitado
    ) {
        static DetalleResponseDTO from(DetalleRecojo d) {
            return new DetalleResponseDTO(
                    d.getTipoResiduo().getId(),
                    d.getTipoResiduo().getNombre(),
                    d.getKilogramos(),
                    d.getCo2Evitado());
        }
    }

    public static RecojoResponseDTO from(Recojo r) {
        List<DetalleResponseDTO> detalles = r.getDetalles().stream()
                .map(DetalleResponseDTO::from)
                .toList();
        BigDecimal kgTotal = r.getDetalles().stream()
                .map(DetalleRecojo::getKilogramos)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal co2Total = r.getDetalles().stream()
                .map(DetalleRecojo::getCo2Evitado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new RecojoResponseDTO(
                r.getId(),
                r.getPuntoAcopio().getId(),
                r.getPuntoAcopio().getDireccion(),
                r.getPuntoAcopio().getDistrito(),
                r.getVecinoId(),
                r.getRecicladorId(),
                r.getEstado().name(),
                r.getFechaSolicitud(),
                r.getFechaRecojo(),
                r.getObservacion(),
                detalles,
                kgTotal,
                co2Total);
    }
}
