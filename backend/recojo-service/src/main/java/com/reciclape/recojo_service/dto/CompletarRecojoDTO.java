package com.reciclape.recojo_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public record CompletarRecojoDTO(
        @NotEmpty @Valid List<DetalleCrearDTO> detalles
) {
    public record DetalleCrearDTO(
            @NotNull Long tipoResiduoId,
            @NotNull @Positive BigDecimal kilogramos
    ) {
    }
}
