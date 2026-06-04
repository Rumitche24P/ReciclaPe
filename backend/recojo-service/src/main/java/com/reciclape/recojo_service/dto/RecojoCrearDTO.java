package com.reciclape.recojo_service.dto;

import jakarta.validation.constraints.NotNull;

public record RecojoCrearDTO(
        @NotNull Long puntoAcopioId,
        @NotNull Long vecinoId,
        String observacion
) {
}
