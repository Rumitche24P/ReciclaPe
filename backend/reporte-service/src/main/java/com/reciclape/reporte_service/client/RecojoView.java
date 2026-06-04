package com.reciclape.reporte_service.client;

import java.math.BigDecimal;
import java.util.List;

/** Vista (parcial) de un recojo tal como lo expone recojo-service. */
public record RecojoView(
        Long id,
        String distrito,
        Long vecinoId,
        Long recicladorId,
        String estado,
        BigDecimal kgTotal,
        BigDecimal co2TotalEvitado,
        List<DetalleView> detalles
) {
    public record DetalleView(
            Long tipoResiduoId,
            String tipoResiduo,
            BigDecimal kilogramos,
            BigDecimal co2Evitado
    ) {
    }
}
