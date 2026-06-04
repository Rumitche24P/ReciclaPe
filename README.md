# ♻️ ReciclaPe

Plataforma de gestión de reciclaje vecinal basada en **microservicios**, desarrollada para el curso
**Desarrollo de Aplicaciones Web II (4697) — CIBERTEC**.

Conecta a **vecinos** con **recicladores formales** de un distrito: permite solicitar y dar seguimiento
a los recojos de residuos segregados en origen, registrar los kilogramos recuperados por tipo de
residuo y reportar el **impacto ambiental** generado (kg recuperados y CO₂ evitado).

---

## 📑 Tabla de contenido
- [Arquitectura](#-arquitectura)
- [Funcionalidades por rol](#-funcionalidades-por-rol)
- [Stack tecnológico](#-stack-tecnológico)
- [Estructura del repositorio](#-estructura-del-repositorio)
- [Cómo ejecutar](#-cómo-ejecutar)
- [Variables de entorno](#-variables-de-entorno)
- [Usuarios de prueba](#-usuarios-de-prueba)
- [API REST](#-api-rest)
- [Pruebas](#-pruebas)
- [Observabilidad](#-observabilidad)
- [Notas y solución de problemas](#-notas-y-solución-de-problemas)
- [Documentación del proyecto](#-documentación-del-proyecto)

---

## 🏗 Arquitectura

El frontend Angular consume todo a través de un **API Gateway**, que valida el JWT y rutea hacia los
microservicios descubiertos por **Eureka**. La comunicación entre servicios es **síncrona** (Feign +
Circuit Breaker) y **asíncrona** (evento `RecojoCompletado` por RabbitMQ). La observabilidad se cubre
con Actuator → Prometheus → Grafana.

![Arquitectura de microservicios](docs/Anexo-A-Diagramas/img/03-arquitectura-general.png)

| Componente | Responsabilidad | Tecnología | Puerto |
|---|---|---|---|
| `eureka-server` | Service discovery | Spring Cloud Netflix Eureka | 8761 |
| `api-gateway` | Punto único de entrada, validación JWT, CORS, ruteo | Spring Cloud Gateway (WebMVC) | 8080 |
| `auth-service` | Registro, login y gestión de usuarios | Spring Security + JWT + BCrypt · `auth_db` | 8081 |
| `recojo-service` | CRUD de puntos, tipos de residuo y recojos; publica eventos | Spring Data JPA + RabbitMQ · `recojo_db` | 8082 |
| `reporte-service` | KPIs e impacto ambiental; consume eventos | OpenFeign + Resilience4J + RabbitMQ · `reporte_db` | 8083 |
| `frontend` | SPA por roles | Angular 21 + Nginx | 4200 |
| `postgres` | Persistencia (una BD por servicio) | PostgreSQL 16 | 5432 |
| `rabbitmq` | Mensajería asíncrona (+ consola) | RabbitMQ | 5672 / 15672 |
| `prometheus` · `grafana` | Métricas y dashboards | Prometheus · Grafana | 9090 · 3000 |

> Más diagramas (casos de uso, modelo E-R, secuencias, clases, despliegue, endpoints) en
> [`docs/Anexo-A-Diagramas/`](docs/Anexo-A-Diagramas/).

---

## 👥 Funcionalidades por rol

**Vecino**
- Registro / inicio de sesión.
- Gestión de **puntos de acopio** (crear, editar, eliminar).
- **Solicitar** y consultar recojos; ver su **historial** y su **dashboard de impacto personal**.

**Reciclador**
- Consultar **recojos disponibles** en su zona.
- **Aceptar** un recojo y **completarlo** registrando los kilogramos por tipo de residuo
  (esto dispara el cálculo de CO₂ y publica el evento `RecojoCompletado`).

**Administrador municipal**
- **Dashboard distrital** con KPIs (recojos completados, kg recuperados, CO₂ evitado) y ranking por tipo.
- CRUD de **tipos de residuo** y gestión de **usuarios**.

---

## 🧰 Stack tecnológico

- **Backend:** Java 21 · Spring Boot 4.0.6 · Spring Cloud 2025.1.1 (Gateway, Eureka, OpenFeign,
  Resilience4J) · Spring Data JPA · Spring Security + JWT (jjwt) + BCrypt · Spring AMQP (RabbitMQ) ·
  Actuator + Micrometer/Prometheus · Lombok.
- **Frontend:** Angular 21 (componentes standalone, signals, lazy loading) · HttpClient con
  interceptores (JWT y errores) · guards por rol.
- **Datos:** PostgreSQL 16 (una base por microservicio).
- **Infraestructura:** Docker / Docker Compose · Prometheus · Grafana.
- **Pruebas:** JUnit 5 + `@DataJpaTest` (capa de acceso a datos) con H2.

---

## 📁 Estructura del repositorio

```
ReciclaPe/
├── backend/                      # POM padre multi-módulo (Maven)
│   ├── eureka-server/            # Service discovery
│   ├── api-gateway/              # Gateway + validación JWT + CORS
│   ├── auth-service/             # Autenticación y usuarios
│   ├── recojo-service/           # Dominio: puntos, tipos, recojos
│   └── reporte-service/          # Reportes e impacto (Feign + RabbitMQ)
├── frontend/                     # SPA Angular (vecino, reciclador, admin)
├── infra/
│   ├── docker-compose.yml        # Orquestación del stack completo
│   ├── postgres/init.sql         # Crea auth_db, recojo_db, reporte_db
│   └── prometheus/prometheus.yml # Scrapeo de métricas
└── docs/                         # Informe, plan técnico, anexos y diagramas
```

---

## 🚀 Cómo ejecutar

### Opción A — Todo con Docker (recomendada)
**Requisito:** Docker Desktop. Desde la carpeta `infra/`:
```bash
cd infra
docker compose up --build
```
La primera vez compila las imágenes y descarga dependencias (puede tardar varios minutos).
Cuando todo esté arriba:

| Servicio | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API Gateway | http://localhost:8080 |
| Eureka | http://localhost:8761 |
| RabbitMQ (consola) | http://localhost:15672 (guest / guest) |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 (admin / admin) |

Para detener: `Ctrl+C` y luego `docker compose down` (agrega `-v` para borrar también los datos).

### Opción B — Local (desarrollo)
**Requisitos:** Java 21, Maven 3.9+, Node 20+, y PostgreSQL 16 y RabbitMQ corriendo en `localhost`.

1. Crear las bases de datos (una vez):
   ```bash
   psql -U postgres -f infra/postgres/init.sql
   ```
2. Levantar el backend (cada servicio en su propia terminal, **en este orden**):
   ```bash
   cd backend
   mvn -pl eureka-server   spring-boot:run
   mvn -pl auth-service    spring-boot:run
   mvn -pl recojo-service  spring-boot:run
   mvn -pl reporte-service spring-boot:run
   mvn -pl api-gateway     spring-boot:run
   ```
3. Levantar el frontend:
   ```bash
   cd frontend
   npm install
   npm start          # http://localhost:4200
   ```

Las **tablas** las genera Hibernate (`ddl-auto=update`) y los **datos semilla** (roles, usuarios,
tipos de residuo y recojos de ejemplo) se cargan automáticamente en el primer arranque.

---

## ⚙️ Variables de entorno

Todos los servicios funcionan con valores por defecto para desarrollo local; en Docker se
sobreescriben desde `docker-compose.yml`.

| Variable | Servicios | Valor por defecto | Descripción |
|---|---|---|---|
| `DB_HOST` / `DB_PORT` | auth, recojo, reporte | `localhost` / `5432` | Host y puerto de PostgreSQL |
| `DB_USER` / `DB_PASSWORD` | auth, recojo, reporte | `postgres` / `postgres` | Credenciales de PostgreSQL |
| `RABBITMQ_HOST` / `RABBITMQ_PORT` | recojo, reporte | `localhost` / `5672` | Broker RabbitMQ |
| `EUREKA_URL` | todos | `http://localhost:8761/eureka` | URL del servidor Eureka |
| `JWT_SECRET` | auth, gateway | (clave de desarrollo) | Secreto HMAC para firmar/validar el JWT (igual en ambos) |
| `JWT_EXPIRATION_MS` | auth | `86400000` (24 h) | Vigencia del token |
| `CORS_ORIGINS` | gateway | `http://localhost:4200` | Orígenes permitidos por CORS |
| `SERVER_PORT` | cualquiera | (puerto del servicio) | Sobrescribe el puerto de escucha |

---

## 🔑 Usuarios de prueba

Contraseña para todos: **`ReciclaPe2026`**

| Rol | Correo |
|---|---|
| Administrador | `admin@reciclape.pe` |
| Vecino | `lucia.vecino@reciclape.pe` |
| Reciclador | `marta.recicla@reciclape.pe` |

---

## 🌐 API REST

Todas las rutas pasan por el gateway (`http://localhost:8080`). Salvo el login/registro, requieren
el header `Authorization: Bearer <jwt>`.

**auth-service**
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/registro` | Registro (password → BCrypt) |
| POST | `/api/auth/login` | Login, devuelve JWT |
| GET / PUT / DELETE | `/api/usuarios`, `/api/usuarios/{id}` | Gestión de usuarios |

**recojo-service**
| Método | Ruta | Descripción |
|---|---|---|
| GET POST PUT DELETE | `/api/puntos-acopio` | CRUD de puntos de acopio |
| GET POST PUT DELETE | `/api/tipos-residuo` | CRUD de tipos de residuo |
| GET | `/api/recojos?estado=` | Listar recojos (filtra por estado/vecino/reciclador) |
| POST | `/api/recojos` | Solicitar recojo |
| PUT | `/api/recojos/{id}/aceptar` · `/completar` · `/cancelar` | Transiciones de estado |

**reporte-service**
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/reportes/impacto-distrital` | KPIs agregados del distrito |
| GET | `/api/reportes/impacto-vecino/{id}` | Impacto de un vecino |
| GET | `/api/reportes/ranking-tipos` | Ranking de tipos recuperados |

> Colección Postman lista para importar en
> [`docs/Anexo-D-ReciclaPe.postman_collection.json`](docs/Anexo-D-ReciclaPe.postman_collection.json).

---

## 🧪 Pruebas

```bash
cd backend
mvn test
```
Incluye pruebas `@DataJpaTest` de la **capa de acceso a datos** (insertar, listar, actualizar y
eliminar) en `auth-service` y `recojo-service`, usando una base H2 en memoria.

---

## 📊 Observabilidad

- Cada servicio expone **Spring Boot Actuator** en `/actuator` (health, metrics, prometheus).
- **Prometheus** (`:9090`) scrapea `/actuator/prometheus` de todos los servicios.
- **Grafana** (`:3000`) se conecta a Prometheus para construir dashboards de latencia y errores.
- `reporte-service` expone además el estado de los **circuit breakers** en `/actuator/circuitbreakers`.

---

## 🛠 Notas y solución de problemas

- **La primera ejecución es lenta**: Maven/npm descargan dependencias y Docker construye las imágenes.
- **Puerto ocupado** (p. ej. `8080` o `5432` en uso por otra app): en local puedes cambiar el puerto
  con `SERVER_PORT` / `DB_PORT`; recuerda actualizar `frontend/src/app/core/api.config.ts` si mueves
  el gateway.
- **El gateway responde 401**: la ruta requiere JWT; primero haz login y envía el header `Authorization`.
- **`docker compose down -v`** borra el volumen de PostgreSQL (se vuelven a sembrar los datos al subir).
- Los servicios arrancan aunque RabbitMQ aún no esté listo (reconexión automática); el evento de
  impacto se procesa cuando el broker está disponible.

---

## 📚 Documentación del proyecto

En [`docs/`](docs/): informe del proyecto, plan técnico, análisis sílabo-vs-proyecto, anexos
(diagramas, script SQL, colección Postman, guion del video) y la presentación de sustentación.

---

_Proyecto académico — CIBERTEC, Desarrollo de Aplicaciones Web II (4697), 2026._
