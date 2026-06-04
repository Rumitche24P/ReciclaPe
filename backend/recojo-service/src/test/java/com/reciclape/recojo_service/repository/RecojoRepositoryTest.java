package com.reciclape.recojo_service.repository;

import com.reciclape.recojo_service.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pruebas de la capa de acceso a datos (rúbrica AP1):
 * insertar, listar, actualizar y eliminar recojos.
 */
@DataJpaTest
class RecojoRepositoryTest {

    @Autowired
    private RecojoRepository recojoRepository;

    @Autowired
    private PuntoAcopioRepository puntoAcopioRepository;

    @Autowired
    private TipoResiduoRepository tipoResiduoRepository;

    private PuntoAcopio punto;

    @BeforeEach
    void setUp() {
        PuntoAcopio p = new PuntoAcopio();
        p.setVecinoId(1L);
        p.setDireccion("Av. Pardo 123");
        p.setDistrito("Miraflores");
        p.setActivo(true);
        punto = puntoAcopioRepository.save(p);
    }

    private Recojo nuevoRecojo(EstadoRecojo estado) {
        Recojo r = new Recojo();
        r.setPuntoAcopio(punto);
        r.setVecinoId(1L);
        r.setEstado(estado);
        return r;
    }

    @Test
    void insertar_guardaRecojoConId() {
        Recojo guardado = recojoRepository.save(nuevoRecojo(EstadoRecojo.SOLICITADO));

        assertThat(guardado.getId()).isNotNull();
        assertThat(guardado.getFechaSolicitud()).isNotNull();
    }

    @Test
    void insertar_conDetallesCalculaCascada() {
        TipoResiduo papel = new TipoResiduo();
        papel.setNombre("Papel");
        papel.setFactorCo2Kg(new BigDecimal("0.900"));
        papel.setPrecioKg(BigDecimal.ZERO);
        papel = tipoResiduoRepository.save(papel);

        Recojo r = nuevoRecojo(EstadoRecojo.COMPLETADO);
        DetalleRecojo d = new DetalleRecojo();
        d.setTipoResiduo(papel);
        d.setKilogramos(new BigDecimal("5.00"));
        d.setCo2Evitado(new BigDecimal("4.500"));
        r.agregarDetalle(d);

        Recojo guardado = recojoRepository.save(r);

        assertThat(guardado.getDetalles()).hasSize(1);
        assertThat(guardado.getDetalles().get(0).getId()).isNotNull();
    }

    @Test
    void listar_porEstadoFiltraCorrectamente() {
        recojoRepository.save(nuevoRecojo(EstadoRecojo.SOLICITADO));
        recojoRepository.save(nuevoRecojo(EstadoRecojo.SOLICITADO));
        recojoRepository.save(nuevoRecojo(EstadoRecojo.COMPLETADO));

        List<Recojo> solicitados = recojoRepository.findByEstado(EstadoRecojo.SOLICITADO);

        assertThat(solicitados).hasSize(2);
    }

    @Test
    void actualizar_cambiaElEstado() {
        Recojo guardado = recojoRepository.save(nuevoRecojo(EstadoRecojo.SOLICITADO));

        guardado.setEstado(EstadoRecojo.ACEPTADO);
        guardado.setRecicladorId(3L);
        recojoRepository.save(guardado);

        Optional<Recojo> recargado = recojoRepository.findById(guardado.getId());
        assertThat(recargado).isPresent();
        assertThat(recargado.get().getEstado()).isEqualTo(EstadoRecojo.ACEPTADO);
        assertThat(recargado.get().getRecicladorId()).isEqualTo(3L);
    }

    @Test
    void eliminar_borraElRecojo() {
        Recojo guardado = recojoRepository.save(nuevoRecojo(EstadoRecojo.SOLICITADO));
        Long id = guardado.getId();

        recojoRepository.deleteById(id);

        assertThat(recojoRepository.findById(id)).isEmpty();
    }
}
