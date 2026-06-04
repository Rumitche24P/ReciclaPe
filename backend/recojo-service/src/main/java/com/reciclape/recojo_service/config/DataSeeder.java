package com.reciclape.recojo_service.config;

import com.reciclape.recojo_service.entity.*;
import com.reciclape.recojo_service.repository.PuntoAcopioRepository;
import com.reciclape.recojo_service.repository.RecojoRepository;
import com.reciclape.recojo_service.repository.TipoResiduoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Carga tipos de residuo, puntos de acopio y recojos de ejemplo si la base está vacía. */
@Component
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private final TipoResiduoRepository tipoRepo;
    private final PuntoAcopioRepository puntoRepo;
    private final RecojoRepository recojoRepo;

    public DataSeeder(TipoResiduoRepository tipoRepo, PuntoAcopioRepository puntoRepo,
                      RecojoRepository recojoRepo) {
        this.tipoRepo = tipoRepo;
        this.puntoRepo = puntoRepo;
        this.recojoRepo = recojoRepo;
    }

    @Override
    public void run(String... args) {
        if (tipoRepo.count() == 0) {
            tipoRepo.save(tipo("Papel", "Papel blanco y de oficina", "0.900", "0.50"));
            tipoRepo.save(tipo("Cartón", "Cajas y empaques de cartón", "0.800", "0.40"));
            tipoRepo.save(tipo("Plástico PET", "Botellas PET transparentes", "1.500", "0.80"));
            tipoRepo.save(tipo("Vidrio", "Botellas y frascos de vidrio", "0.300", "0.20"));
            tipoRepo.save(tipo("Metal", "Latas de aluminio y chatarra", "2.000", "1.20"));
        }

        if (puntoRepo.count() == 0) {
            PuntoAcopio p1 = puntoRepo.save(punto(1L, "Av. Pardo 123, Dpto 401", "Miraflores", "Frente al parque Kennedy"));
            puntoRepo.save(punto(1L, "Calle Lima 456", "Miraflores", "Edificio azul"));
            PuntoAcopio p3 = puntoRepo.save(punto(2L, "Jr. Berlín 789", "Miraflores", "Esquina con grifo"));

            if (recojoRepo.count() == 0) {
                // Recojo COMPLETADO con detalles
                Recojo completado = new Recojo();
                completado.setPuntoAcopio(p1);
                completado.setVecinoId(1L);
                completado.setRecicladorId(3L);
                completado.setEstado(EstadoRecojo.COMPLETADO);
                completado.setFechaSolicitud(LocalDateTime.now().minusDays(14));
                completado.setFechaRecojo(LocalDateTime.now().minusDays(14).plusHours(6));
                completado.setObservacion("Entregado en buen estado");
                agregarDetalle(completado, tipoRepo.findByNombreIgnoreCase("Papel").orElseThrow(), "5.00");
                agregarDetalle(completado, tipoRepo.findByNombreIgnoreCase("Plástico PET").orElseThrow(), "3.00");
                agregarDetalle(completado, tipoRepo.findByNombreIgnoreCase("Vidrio").orElseThrow(), "8.00");
                recojoRepo.save(completado);

                // Recojo ACEPTADO
                Recojo aceptado = new Recojo();
                aceptado.setPuntoAcopio(p3);
                aceptado.setVecinoId(2L);
                aceptado.setRecicladorId(4L);
                aceptado.setEstado(EstadoRecojo.ACEPTADO);
                aceptado.setFechaSolicitud(LocalDateTime.now().minusDays(3));
                aceptado.setObservacion("Programado para el fin de semana");
                recojoRepo.save(aceptado);

                // Recojo SOLICITADO
                Recojo solicitado = new Recojo();
                solicitado.setPuntoAcopio(p1);
                solicitado.setVecinoId(1L);
                solicitado.setEstado(EstadoRecojo.SOLICITADO);
                solicitado.setFechaSolicitud(LocalDateTime.now().minusHours(5));
                recojoRepo.save(solicitado);
            }
        }
    }

    private TipoResiduo tipo(String nombre, String desc, String factor, String precio) {
        TipoResiduo t = new TipoResiduo();
        t.setNombre(nombre);
        t.setDescripcion(desc);
        t.setFactorCo2Kg(new BigDecimal(factor));
        t.setPrecioKg(new BigDecimal(precio));
        t.setActivo(true);
        return t;
    }

    private PuntoAcopio punto(Long vecinoId, String dir, String distrito, String ref) {
        PuntoAcopio p = new PuntoAcopio();
        p.setVecinoId(vecinoId);
        p.setDireccion(dir);
        p.setDistrito(distrito);
        p.setReferencia(ref);
        p.setActivo(true);
        return p;
    }

    private void agregarDetalle(Recojo recojo, TipoResiduo tipo, String kg) {
        DetalleRecojo d = new DetalleRecojo();
        d.setTipoResiduo(tipo);
        d.setKilogramos(new BigDecimal(kg));
        d.setCo2Evitado(new BigDecimal(kg).multiply(tipo.getFactorCo2Kg()));
        recojo.agregarDetalle(d);
    }
}
