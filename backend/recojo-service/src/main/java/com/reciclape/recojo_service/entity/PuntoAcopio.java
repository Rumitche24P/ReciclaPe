package com.reciclape.recojo_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "punto_acopio")
@Getter
@Setter
@NoArgsConstructor
public class PuntoAcopio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Referencia lógica al usuario VECINO en auth_db */
    @Column(name = "vecino_id", nullable = false)
    private Long vecinoId;

    @Column(nullable = false, length = 200)
    private String direccion;

    @Column(nullable = false, length = 80)
    private String distrito;

    @Column(length = 200)
    private String referencia;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitud;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitud;

    @Column(nullable = false)
    private boolean activo = true;
}
