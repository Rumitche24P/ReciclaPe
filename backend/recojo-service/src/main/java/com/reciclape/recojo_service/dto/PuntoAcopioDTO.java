package com.reciclape.recojo_service.dto;

import com.reciclape.recojo_service.entity.PuntoAcopio;

import java.math.BigDecimal;

public record PuntoAcopioDTO(
        Long id,
        Long vecinoId,
        String direccion,
        String distrito,
        String referencia,
        BigDecimal latitud,
        BigDecimal longitud,
        boolean activo
) {
    public static PuntoAcopioDTO from(PuntoAcopio p) {
        return new PuntoAcopioDTO(p.getId(), p.getVecinoId(), p.getDireccion(), p.getDistrito(),
                p.getReferencia(), p.getLatitud(), p.getLongitud(), p.isActivo());
    }
}
