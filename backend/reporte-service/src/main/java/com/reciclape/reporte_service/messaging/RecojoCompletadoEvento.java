package com.reciclape.reporte_service.messaging;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Copia del evento publicado por recojo-service (mismos nombres de campo para deserializar). */
public record RecojoCompletadoEvento(
        Long recojoId,
        Long vecinoId,
        Long recicladorId,
        String distrito,
        BigDecimal kgTotal,
        BigDecimal co2TotalEvitado,
        LocalDateTime fechaRecojo
) implements Serializable {
}
