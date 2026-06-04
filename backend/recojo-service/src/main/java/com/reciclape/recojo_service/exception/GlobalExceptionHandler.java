package com.reciclape.recojo_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> body(HttpStatus status, String mensaje) {
        Map<String, Object> m = new HashMap<>();
        m.put("timestamp", LocalDateTime.now().toString());
        m.put("status", status.value());
        m.put("error", status.getReasonPhrase());
        m.put("message", mensaje);
        return m;
    }

    @ExceptionHandler(ApiExceptions.RecursoNoEncontrado.class)
    public ResponseEntity<Map<String, Object>> noEncontrado(ApiExceptions.RecursoNoEncontrado ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body(HttpStatus.NOT_FOUND, ex.getMessage()));
    }

    @ExceptionHandler(ApiExceptions.ReglaNegocio.class)
    public ResponseEntity<Map<String, Object>> reglaNegocio(ApiExceptions.ReglaNegocio ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body(HttpStatus.CONFLICT, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacion(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .orElse("Datos invalidos");
        return ResponseEntity.badRequest().body(body(HttpStatus.BAD_REQUEST, msg));
    }
}
