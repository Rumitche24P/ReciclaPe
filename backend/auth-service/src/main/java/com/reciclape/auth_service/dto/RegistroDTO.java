package com.reciclape.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroDTO(
        @NotBlank String nombres,
        @NotBlank String apellidos,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres") String password,
        String telefono,
        @NotBlank String rol // VECINO, RECICLADOR, ADMIN
) {
}
