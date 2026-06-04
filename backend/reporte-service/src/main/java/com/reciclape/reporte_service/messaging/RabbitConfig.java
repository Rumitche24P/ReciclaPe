package com.reciclape.reporte_service.messaging;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "reciclape.exchange";
    public static final String ROUTING_KEY_RECOJO_COMPLETADO = "recojo.completado";
    public static final String QUEUE_RECOJO_COMPLETADO = "recojo.completado.queue";

    @Bean
    public TopicExchange reciclapeExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    @Bean
    public Queue recojoCompletadoQueue() {
        return new Queue(QUEUE_RECOJO_COMPLETADO, true);
    }

    @Bean
    public Binding recojoCompletadoBinding(Queue recojoCompletadoQueue, TopicExchange reciclapeExchange) {
        return BindingBuilder.bind(recojoCompletadoQueue)
                .to(reciclapeExchange)
                .with(ROUTING_KEY_RECOJO_COMPLETADO);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new JacksonJsonMessageConverter();
    }
}
