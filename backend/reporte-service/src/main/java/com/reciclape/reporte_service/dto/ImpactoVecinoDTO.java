package com.reciclape.reporte_service.dto;

import java.math.BigDecimal;

public record ImpactoVecinoDTO(
        Long vecinoId,
        long recojosCompletados,
        BigDecimal kgTotalRecuperado,
        BigDecimal co2TotalEvitado,
        String fuente
) {
}
