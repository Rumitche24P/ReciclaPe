package com.reciclape.recojo_service.controller;

import com.reciclape.recojo_service.dto.AceptarRecojoDTO;
import com.reciclape.recojo_service.dto.CompletarRecojoDTO;
import com.reciclape.recojo_service.dto.RecojoCrearDTO;
import com.reciclape.recojo_service.dto.RecojoResponseDTO;
import com.reciclape.recojo_service.entity.EstadoRecojo;
import com.reciclape.recojo_service.service.RecojoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recojos")
public class RecojoController {

    private final RecojoService service;

    public RecojoController(RecojoService service) {
        this.service = service;
    }

    @GetMapping
    public List<RecojoResponseDTO> listar(
            @RequestParam(required = false) EstadoRecojo estado,
            @RequestParam(required = false) Long vecinoId,
            @RequestParam(required = false) Long recicladorId) {
        return service.listar(estado, vecinoId, recicladorId);
    }

    @GetMapping("/{id}")
    public RecojoResponseDTO obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    public ResponseEntity<RecojoResponseDTO> crear(@Valid @RequestBody RecojoCrearDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
    }

    @PutMapping("/{id}/aceptar")
    public RecojoResponseDTO aceptar(@PathVariable Long id, @Valid @RequestBody AceptarRecojoDTO dto) {
        return service.aceptar(id, dto);
    }

    @PutMapping("/{id}/completar")
    public RecojoResponseDTO completar(@PathVariable Long id, @Valid @RequestBody CompletarRecojoDTO dto) {
        return service.completar(id, dto);
    }

    @PutMapping("/{id}/cancelar")
    public RecojoResponseDTO cancelar(@PathVariable Long id) {
        return service.cancelar(id);
    }
}
