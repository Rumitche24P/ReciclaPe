package com.reciclape.reporte_service.controller;

import com.reciclape.reporte_service.dto.ImpactoDistritalDTO;
import com.reciclape.reporte_service.dto.ImpactoVecinoDTO;
import com.reciclape.reporte_service.dto.RankingTipoDTO;
import com.reciclape.reporte_service.service.ReporteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteService service;

    public ReporteController(ReporteService service) {
        this.service = service;
    }

    @GetMapping("/impacto-distrital")
    public ImpactoDistritalDTO impactoDistrital() {
        return service.impactoDistrital();
    }

    @GetMapping("/impacto-vecino/{vecinoId}")
    public ImpactoVecinoDTO impactoVecino(@PathVariable Long vecinoId) {
        return service.impactoVecino(vecinoId);
    }

    @GetMapping("/ranking-tipos")
    public List<RankingTipoDTO> rankingTipos() {
        return service.rankingTipos();
    }
}
