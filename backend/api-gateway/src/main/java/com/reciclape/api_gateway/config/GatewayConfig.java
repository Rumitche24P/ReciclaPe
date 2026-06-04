package com.reciclape.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.web.servlet.function.RequestPredicates.path;

/**
 * Rutas del API Gateway. Cada microservicio se resuelve por nombre vía Eureka
 * (load balancer) usando el filtro lb(...).
 */
@Configuration
public class GatewayConfig {

    @Bean
    public RouterFunction<ServerResponse> authServiceRoutes() {
        return route("auth-service")
                .route(path("/api/auth/**"), http())
                .route(path("/api/usuarios/**"), http())
                .filter(lb("auth-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> recojoServiceRoutes() {
        return route("recojo-service")
                .route(path("/api/puntos-acopio/**"), http())
                .route(path("/api/tipos-residuo/**"), http())
                .route(path("/api/recojos/**"), http())
                .filter(lb("recojo-service"))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> reporteServiceRoutes() {
        return route("reporte-service")
                .route(path("/api/reportes/**"), http())
                .filter(lb("reporte-service"))
                .build();
    }
}
