package com.reciclape.reporte_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Registro local de cada evento RecojoCompletado recibido por RabbitMQ.
 * Permite calcular KPIs incluso si recojo-service no está disponible (fallback).
 */
@Entity
@Table(name = "impacto_evento")
@Getter
@Setter
@NoArgsConstructor
public class ImpactoEvento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recojo_id", nullable = false, unique = true)
    private Long recojoId;

    @Column(name = "vecino_id")
    private Long vecinoId;

    @Column(length = 80)
    private String distrito;

    @Column(name = "kg_total", precision = 12, scale = 2)
    private BigDecimal kgTotal;

    @Column(name = "co2_total_evitado", precision = 12, scale = 3)
    private BigDecimal co2TotalEvitado;

    @Column(name = "fecha_recojo")
    private LocalDateTime fechaRecojo;

    @Column(name = "recibido_en", nullable = false)
    private LocalDateTime recibidoEn;

    @PrePersist
    public void prePersist() {
        if (recibidoEn == null) {
            recibidoEn = LocalDateTime.now();
        }
    }
}
