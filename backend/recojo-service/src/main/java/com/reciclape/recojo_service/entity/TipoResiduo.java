package com.reciclape.recojo_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "tipo_residuo")
@Getter
@Setter
@NoArgsConstructor
public class TipoResiduo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String nombre;

    @Column(length = 200)
    private String descripcion;

    /** kg de CO2 evitado por cada kg reciclado de este material */
    @Column(name = "factor_co2_kg", nullable = false, precision = 8, scale = 3)
    private BigDecimal factorCo2Kg;

    @Column(name = "precio_kg", nullable = false, precision = 8, scale = 2)
    private BigDecimal precioKg = BigDecimal.ZERO;

    @Column(nullable = false)
    private boolean activo = true;
}
