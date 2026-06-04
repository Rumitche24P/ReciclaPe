package com.reciclape.reporte_service.dto;

import java.math.BigDecimal;

public record RankingTipoDTO(
        String tipoResiduo,
        BigDecimal kgTotal,
        BigDecimal co2Evitado
) {
}
