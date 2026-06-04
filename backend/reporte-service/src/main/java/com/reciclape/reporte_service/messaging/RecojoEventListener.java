package com.reciclape.reporte_service.messaging;

import com.reciclape.reporte_service.entity.ImpactoEvento;
import com.reciclape.reporte_service.repository.ImpactoEventoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/** Consume los eventos RecojoCompletado y los persiste para el cálculo de KPIs. */
@Component
public class RecojoEventListener {

    private static final Logger log = LoggerFactory.getLogger(RecojoEventListener.class);

    private final ImpactoEventoRepository repository;

    public RecojoEventListener(ImpactoEventoRepository repository) {
        this.repository = repository;
    }

    @RabbitListener(queues = RabbitConfig.QUEUE_RECOJO_COMPLETADO)
    public void onRecojoCompletado(RecojoCompletadoEvento evento) {
        if (evento.recojoId() == null || repository.existsByRecojoId(evento.recojoId())) {
            return; // idempotencia: no duplicar el mismo recojo
        }
        ImpactoEvento e = new ImpactoEvento();
        e.setRecojoId(evento.recojoId());
        e.setVecinoId(evento.vecinoId());
        e.setDistrito(evento.distrito());
        e.setKgTotal(evento.kgTotal());
        e.setCo2TotalEvitado(evento.co2TotalEvitado());
        e.setFechaRecojo(evento.fechaRecojo());
        repository.save(e);
        log.info("Evento RecojoCompletado recibido y almacenado: recojoId={}", evento.recojoId());
    }
}
