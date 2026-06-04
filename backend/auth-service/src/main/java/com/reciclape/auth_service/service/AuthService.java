package com.reciclape.auth_service.service;

import com.reciclape.auth_service.dto.LoginDTO;
import com.reciclape.auth_service.dto.RegistroDTO;
import com.reciclape.auth_service.dto.TokenDTO;
import com.reciclape.auth_service.dto.UsuarioDTO;
import com.reciclape.auth_service.entity.Rol;
import com.reciclape.auth_service.entity.Usuario;
import com.reciclape.auth_service.exception.ApiExceptions;
import com.reciclape.auth_service.repository.RolRepository;
import com.reciclape.auth_service.repository.UsuarioRepository;
import com.reciclape.auth_service.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, RolRepository rolRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UsuarioDTO registrar(RegistroDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new ApiExceptions.ReglaNegocio("El email ya está registrado");
        }
        Rol rol = rolRepository.findByNombre(dto.rol().toUpperCase())
                .orElseThrow(() -> new ApiExceptions.ReglaNegocio("Rol no válido: " + dto.rol()));

        Usuario usuario = new Usuario();
        usuario.setNombres(dto.nombres());
        usuario.setApellidos(dto.apellidos());
        usuario.setEmail(dto.email());
        usuario.setPasswordHash(passwordEncoder.encode(dto.password()));
        usuario.setTelefono(dto.telefono());
        usuario.setRol(rol);
        usuario.setActivo(true);

        return UsuarioDTO.from(usuarioRepository.save(usuario));
    }

    @Transactional(readOnly = true)
    public TokenDTO autenticar(LoginDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(ApiExceptions.CredencialesInvalidas::new);

        if (!usuario.isActivo() || !passwordEncoder.matches(dto.password(), usuario.getPasswordHash())) {
            throw new ApiExceptions.CredencialesInvalidas();
        }

        String token = jwtService.generarToken(usuario);
        return TokenDTO.bearer(token, usuario.getId(), usuario.getNombres(),
                usuario.getEmail(), usuario.getRol().getNombre());
    }
}
