package com.reciclape.auth_service.service;

import com.reciclape.auth_service.dto.UsuarioActualizarDTO;
import com.reciclape.auth_service.dto.UsuarioDTO;
import com.reciclape.auth_service.entity.Usuario;
import com.reciclape.auth_service.exception.ApiExceptions;
import com.reciclape.auth_service.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listar() {
        return usuarioRepository.findAll().stream().map(UsuarioDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioDTO obtener(Long id) {
        return usuarioRepository.findById(id)
                .map(UsuarioDTO::from)
                .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado("Usuario no encontrado: " + id));
    }

    @Transactional
    public UsuarioDTO actualizar(Long id, UsuarioActualizarDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado("Usuario no encontrado: " + id));
        usuario.setNombres(dto.nombres());
        usuario.setApellidos(dto.apellidos());
        usuario.setTelefono(dto.telefono());
        return UsuarioDTO.from(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiExceptions.RecursoNoEncontrado("Usuario no encontrado: " + id));
        // baja lógica: se desactiva en lugar de borrar para preservar trazabilidad
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }
}
