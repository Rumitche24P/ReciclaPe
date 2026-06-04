package com.reciclape.recojo_service.messaging;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Evento publicado cuando un recojo pasa a estado COMPLETADO. */
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
