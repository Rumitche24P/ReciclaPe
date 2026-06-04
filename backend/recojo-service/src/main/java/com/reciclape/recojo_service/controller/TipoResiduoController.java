package com.reciclape.recojo_service.controller;

import com.reciclape.recojo_service.dto.TipoResiduoCrearDTO;
import com.reciclape.recojo_service.dto.TipoResiduoDTO;
import com.reciclape.recojo_service.service.TipoResiduoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-residuo")
public class TipoResiduoController {

    private final TipoResiduoService service;

    public TipoResiduoController(TipoResiduoService service) {
        this.service = service;
    }

    @GetMapping
    public List<TipoResiduoDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public TipoResiduoDTO obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    public ResponseEntity<TipoResiduoDTO> crear(@Valid @RequestBody TipoResiduoCrearDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
    }

    @PutMapping("/{id}")
    public TipoResiduoDTO actualizar(@PathVariable Long id, @Valid @RequestBody TipoResiduoCrearDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
