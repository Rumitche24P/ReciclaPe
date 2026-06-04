package com.reciclape.reporte_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Cliente Feign que consume recojo-service de forma síncrona.
 * Se resuelve por nombre de servicio a través de Eureka + LoadBalancer.
 */
@FeignClient(name = "recojo-service")
public interface RecojoFeignClient {

    @GetMapping("/api/recojos")
    List<RecojoView> listarRecojos(@RequestParam(value = "estado", required = false) String estado);

    @GetMapping("/api/recojos")
    List<RecojoView> listarPorVecino(@RequestParam("vecinoId") Long vecinoId);
}
