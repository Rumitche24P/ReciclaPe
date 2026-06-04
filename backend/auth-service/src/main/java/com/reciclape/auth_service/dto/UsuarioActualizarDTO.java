package com.reciclape.auth_service.dto;

import jakarta.validation.constraints.NotBlank;

public record UsuarioActualizarDTO(
        @NotBlank String nombres,
        @NotBlank String apellidos,
        String telefono
) {
}
