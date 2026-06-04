package com.reciclape.recojo_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PuntoAcopioCrearDTO(
        @NotNull Long vecinoId,
        @NotBlank String direccion,
        @NotBlank String distrito,
        String referencia,
        BigDecimal latitud,
        BigDecimal longitud
) {
}
