package com.reciclape.recojo_service.dto;

import com.reciclape.recojo_service.entity.TipoResiduo;

import java.math.BigDecimal;

public record TipoResiduoDTO(
        Long id,
        String nombre,
        String descripcion,
        BigDecimal factorCo2Kg,
        BigDecimal precioKg,
        boolean activo
) {
    public static TipoResiduoDTO from(TipoResiduo t) {
        return new TipoResiduoDTO(t.getId(), t.getNombre(), t.getDescripcion(),
                t.getFactorCo2Kg(), t.getPrecioKg(), t.isActivo());
    }
}
