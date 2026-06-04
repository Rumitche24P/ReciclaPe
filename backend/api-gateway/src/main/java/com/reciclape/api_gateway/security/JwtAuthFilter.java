package com.reciclape.api_gateway.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Valida el JWT en el gateway antes de rutear. Las rutas públicas
 * (login, registro y actuator) no requieren token.
 */
@Component
@Order(2)
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final List<String> RUTAS_PUBLICAS = List.of(
            "/api/auth/", "/actuator/");

    private final SecretKey key;

    public JwtAuthFilter(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        // Permitir preflight CORS y rutas públicas
        if ("OPTIONS".equalsIgnoreCase(request.getMethod()) || esRutaPublica(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token ausente");
            return;
        }

        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(header.substring(7));
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido o expirado");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean esRutaPublica(String uri) {
        return RUTAS_PUBLICAS.stream().anyMatch(uri::startsWith);
    }
}
