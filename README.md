# ♻️ ReciclaPe

Plataforma de gestión de reciclaje vecinal basada en **microservicios**, desarrollada para el curso
**Desarrollo de Aplicaciones Web II (4697) — CIBERTEC**.

Conecta vecinos con recicladores formales, gestiona recojos de residuos segregados y reporta el
impacto ambiental generado (kg recuperados y CO₂ evitado).

## Arquitectura

| Componente | Tecnología | Puerto |
|---|---|---|
| `eureka-server` | Spring Cloud Netflix Eureka (service discovery) | 8761 |
| `api-gateway` | Spring Cloud Gateway (WebMVC) + validación JWT + CORS | 8080 |
| `auth-service` | Spring Security + JWT + BCrypt (auth_db) | 8081 |
| `recojo-service` | Spring Data JPA + RabbitMQ publisher (recojo_db) | 8082 |
| `reporte-service` | OpenFeign + Resilience4J + RabbitMQ consumer (reporte_db) | 8083 |
| `frontend` | Angular 21 (SPA por roles) + Nginx | 4200 |
| PostgreSQL · RabbitMQ · Prometheus · Grafana | Infraestructura | 5432 · 5672/15672 · 9090 · 3000 |

**Stack:** Java 21 · Spring Boot 4.0.6 · Spring Cloud 2025.1.1 · Angular 21 · PostgreSQL 16.

Diagramas completos en [`docs/Anexo-A-Diagramas/`](docs/Anexo-A-Diagramas/).

## Cómo ejecutar

### Opción A — Todo con Docker (recomendada)
```bash
cd infra
docker compose up --build
```
- Frontend: http://localhost:4200
- API Gateway: http://localhost:8080
- Eureka: http://localhost:8761
- RabbitMQ: http://localhost:15672 (guest/guest)
- Prometheus: http://localhost:9090 · Grafana: http://localhost:3000 (admin/admin)

### Opción B — Local (desarrollo)
Requisitos: Java 21, Maven, Node 20+, PostgreSQL 16 y RabbitMQ corriendo en localhost.
```bash
# Backend (cada uno en una terminal, en este orden)
cd backend
mvn -pl eureka-server  spring-boot:run
mvn -pl auth-service   spring-boot:run
mvn -pl recojo-service spring-boot:run
mvn -pl reporte-service spring-boot:run
mvn -pl api-gateway    spring-boot:run

# Frontend
cd frontend && npm install && npm start
```
Las bases `auth_db`, `recojo_db` y `reporte_db` se crean con `infra/postgres/init.sql`
(o manualmente); las tablas las genera Hibernate. Datos semilla se cargan al primer arranque.

## Usuarios de prueba (password: `ReciclaPe2026`)
| Rol | Correo |
|---|---|
| Administrador | admin@reciclape.pe |
| Vecino | lucia.vecino@reciclape.pe |
| Reciclador | marta.recicla@reciclape.pe |

## Pruebas
```bash
cd backend && mvn test      # incluye pruebas @DataJpaTest de la capa de datos
```

## Estructura
```
backend/    5 microservicios Spring Boot (pom padre multi-módulo)
frontend/   SPA Angular por roles (vecino, reciclador, admin)
infra/      docker-compose, Prometheus, init de PostgreSQL
docs/       informe, plan técnico, anexos y diagramas
```
