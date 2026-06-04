package com.reciclape.recojo_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "detalle_recojo")
@Getter
@Setter
@NoArgsConstructor
public class DetalleRecojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recojo_id", nullable = false)
    private Recojo recojo;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "tipo_residuo_id", nullable = false)
    private TipoResiduo tipoResiduo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal kilogramos;

    @Column(name = "co2_evitado", nullable = false, precision = 10, scale = 3)
    private BigDecimal co2Evitado = BigDecimal.ZERO;
}
