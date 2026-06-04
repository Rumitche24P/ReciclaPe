package com.reciclape.recojo_service.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recojo")
@Getter
@Setter
@NoArgsConstructor
public class Recojo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "punto_acopio_id", nullable = false)
    private PuntoAcopio puntoAcopio;

    /** Referencia lógica al usuario VECINO en auth_db */
    @Column(name = "vecino_id", nullable = false)
    private Long vecinoId;

    /** Referencia lógica al usuario RECICLADOR en auth_db (null hasta que se acepta) */
    @Column(name = "reciclador_id")
    private Long recicladorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private EstadoRecojo estado = EstadoRecojo.SOLICITADO;

    @Column(name = "fecha_solicitud", nullable = false)
    private LocalDateTime fechaSolicitud;

    @Column(name = "fecha_recojo")
    private LocalDateTime fechaRecojo;

    @Column(length = 250)
    private String observacion;

    @OneToMany(mappedBy = "recojo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleRecojo> detalles = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (fechaSolicitud == null) {
            fechaSolicitud = LocalDateTime.now();
        }
    }

    public void agregarDetalle(DetalleRecojo detalle) {
        detalle.setRecojo(this);
        this.detalles.add(detalle);
    }
}
