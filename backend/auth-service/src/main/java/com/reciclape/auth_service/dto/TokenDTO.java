package com.reciclape.auth_service.dto;

public record TokenDTO(
        String token,
        String tipo,
        Long usuarioId,
        String nombres,
        String email,
        String rol
) {
    public static TokenDTO bearer(String token, Long usuarioId, String nombres, String email, String rol) {
        return new TokenDTO(token, "Bearer", usuarioId, nombres, email, rol);
    }
}
