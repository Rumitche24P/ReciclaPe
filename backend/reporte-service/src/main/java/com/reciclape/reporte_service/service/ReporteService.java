package com.reciclape.reporte_service.service;

import com.reciclape.reporte_service.client.RecojoFeignClient;
import com.reciclape.reporte_service.client.RecojoView;
import com.reciclape.reporte_service.dto.ImpactoDistritalDTO;
import com.reciclape.reporte_service.dto.ImpactoVecinoDTO;
import com.reciclape.reporte_service.dto.RankingTipoDTO;
import com.reciclape.reporte_service.entity.ImpactoEvento;
import com.reciclape.reporte_service.repository.ImpactoEventoRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReporteService {

    private static final Logger log = LoggerFactory.getLogger(ReporteService.class);
    private static final String CB = "recojoService";
    private static final String COMPLETADO = "COMPLETADO";

    private final RecojoFeignClient recojoClient;
    private final ImpactoEventoRepository eventoRepository;

    public ReporteService(RecojoFeignClient recojoClient, ImpactoEventoRepository eventoRepository) {
        this.recojoClient = recojoClient;
        this.eventoRepository = eventoRepository;
    }

    // ---------------- Impacto distrital ----------------

    @CircuitBreaker(name = CB, fallbackMethod = "impactoDistritalFallback")
    public ImpactoDistritalDTO impactoDistrital() {
        List<RecojoView> completados = recojoClient.listarRecojos(COMPLETADO);
        BigDecimal kg = sumar(completados, RecojoView::kgTotal);
        BigDecimal co2 = sumar(completados, RecojoView::co2TotalEvitado);
        return new ImpactoDistritalDTO(completados.size(), kg, co2, "recojo-service (Feign)");
    }

    @SuppressWarnings("unused")
    private ImpactoDistritalDTO impactoDistritalFallback(Throwable t) {
        log.warn("Fallback impactoDistrital (recojo-service no disponible): {}", t.getMessage());
        List<ImpactoEvento> eventos = eventoRepository.findAll();
        BigDecimal kg = eventos.stream().map(ImpactoEvento::getKgTotal)
                .filter(v -> v != null).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal co2 = eventos.stream().map(ImpactoEvento::getCo2TotalEvitado)
                .filter(v -> v != null).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new ImpactoDistritalDTO(eventos.size(), kg, co2, "eventos locales (fallback)");
    }

    // ---------------- Impacto por vecino ----------------

    @CircuitBreaker(name = CB, fallbackMethod = "impactoVecinoFallback")
    public ImpactoVecinoDTO impactoVecino(Long vecinoId) {
        List<RecojoView> recojos = recojoClient.listarPorVecino(vecinoId).stream()
                .filter(r -> COMPLETADO.equalsIgnoreCase(r.estado()))
                .toList();
        BigDecimal kg = sumar(recojos, RecojoView::kgTotal);
        BigDecimal co2 = sumar(recojos, RecojoView::co2TotalEvitado);
        return new ImpactoVecinoDTO(vecinoId, recojos.size(), kg, co2, "recojo-service (Feign)");
    }

    @SuppressWarnings("unused")
    private ImpactoVecinoDTO impactoVecinoFallback(Long vecinoId, Throwable t) {
        log.warn("Fallback impactoVecino (recojo-service no disponible): {}", t.getMessage());
        List<ImpactoEvento> eventos = eventoRepository.findByVecinoId(vecinoId);
        BigDecimal kg = eventos.stream().map(ImpactoEvento::getKgTotal)
                .filter(v -> v != null).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal co2 = eventos.stream().map(ImpactoEvento::getCo2TotalEvitado)
                .filter(v -> v != null).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new ImpactoVecinoDTO(vecinoId, eventos.size(), kg, co2, "eventos locales (fallback)");
    }

    // ---------------- Ranking por tipo de residuo ----------------

    @CircuitBreaker(name = CB, fallbackMethod = "rankingTiposFallback")
    public List<RankingTipoDTO> rankingTipos() {
        List<RecojoView> completados = recojoClient.listarRecojos(COMPLETADO);
        Map<String, BigDecimal[]> acumulado = new LinkedHashMap<>();
        for (RecojoView r : completados) {
            if (r.detalles() == null) continue;
            for (RecojoView.DetalleView d : r.detalles()) {
                BigDecimal[] acc = acumulado.computeIfAbsent(d.tipoResiduo(),
                        k -> new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
                if (d.kilogramos() != null) acc[0] = acc[0].add(d.kilogramos());
                if (d.co2Evitado() != null) acc[1] = acc[1].add(d.co2Evitado());
            }
        }
        return acumulado.entrySet().stream()
                .map(e -> new RankingTipoDTO(e.getKey(), e.getValue()[0], e.getValue()[1]))
                .sorted((a, b) -> b.kgTotal().compareTo(a.kgTotal()))
                .toList();
    }

    @SuppressWarnings("unused")
    private List<RankingTipoDTO> rankingTiposFallback(Throwable t) {
        log.warn("Fallback rankingTipos (recojo-service no disponible): {}", t.getMessage());
        return List.of();
    }

    // ---------------- helpers ----------------

    private BigDecimal sumar(List<RecojoView> recojos, java.util.function.Function<RecojoView, BigDecimal> campo) {
        return recojos.stream()
                .map(campo)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
