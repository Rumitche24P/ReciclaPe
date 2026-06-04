package com.reciclape.recojo_service.dto;

import jakarta.validation.constraints.NotNull;

public record AceptarRecojoDTO(
        @NotNull Long recicladorId
) {
}
