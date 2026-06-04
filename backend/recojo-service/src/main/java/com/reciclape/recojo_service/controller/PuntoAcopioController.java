package com.reciclape.recojo_service.controller;

import com.reciclape.recojo_service.dto.PuntoAcopioCrearDTO;
import com.reciclape.recojo_service.dto.PuntoAcopioDTO;
import com.reciclape.recojo_service.service.PuntoAcopioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puntos-acopio")
public class PuntoAcopioController {

    private final PuntoAcopioService service;

    public PuntoAcopioController(PuntoAcopioService service) {
        this.service = service;
    }

    @GetMapping
    public List<PuntoAcopioDTO> listar(@RequestParam(required = false) Long vecinoId) {
        return service.listar(vecinoId);
    }

    @GetMapping("/{id}")
    public PuntoAcopioDTO obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    public ResponseEntity<PuntoAcopioDTO> crear(@Valid @RequestBody PuntoAcopioCrearDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
    }

    @PutMapping("/{id}")
    public PuntoAcopioDTO actualizar(@PathVariable Long id, @Valid @RequestBody PuntoAcopioCrearDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
