package com.reciclape.auth_service.dto;

import com.reciclape.auth_service.entity.Usuario;

public record UsuarioDTO(
        Long id,
        String nombres,
        String apellidos,
        String email,
        String telefono,
        String rol,
        boolean activo
) {
    public static UsuarioDTO from(Usuario u) {
        return new UsuarioDTO(
                u.getId(), u.getNombres(), u.getApellidos(), u.getEmail(),
                u.getTelefono(), u.getRol().getNombre(), u.isActivo());
    }
}
