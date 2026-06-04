package com.reciclape.auth_service.controller;

import com.reciclape.auth_service.dto.LoginDTO;
import com.reciclape.auth_service.dto.RegistroDTO;
import com.reciclape.auth_service.dto.TokenDTO;
import com.reciclape.auth_service.dto.UsuarioDTO;
import com.reciclape.auth_service.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/registro")
    public ResponseEntity<UsuarioDTO> registro(@Valid @RequestBody RegistroDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@Valid @RequestBody LoginDTO dto) {
        return ResponseEntity.ok(authService.autenticar(dto));
    }
}
