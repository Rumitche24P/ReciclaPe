package com.reciclape.recojo_service.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
public class RecojoEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(RecojoEventPublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public RecojoEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicarRecojoCompletado(RecojoCompletadoEvento evento) {
        rabbitTemplate.convertAndSend(
                RabbitConfig.EXCHANGE,
                RabbitConfig.ROUTING_KEY_RECOJO_COMPLETADO,
                evento);
        log.info("Evento RecojoCompletado publicado: recojoId={}, co2={}",
                evento.recojoId(), evento.co2TotalEvitado());
    }
}
