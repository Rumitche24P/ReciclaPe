-- =============================================================================
--  ANEXO B — Script SQL de creación e inicialización de la base de datos
--  Proyecto : ReciclaPe — Plataforma de gestión de reciclaje vecinal
--  Curso    : Desarrollo de Aplicaciones Web II (4697) — CIBERTEC
--  Motor    : PostgreSQL 16
--
--  Arquitectura de microservicios => UNA base de datos por servicio:
--      * auth_db    -> auth-service   (ROL, USUARIO)
--      * recojo_db  -> recojo-service (PUNTO_ACOPIO, TIPO_RESIDUO, RECOJO, DETALLE_RECOJO)
--
--  Las referencias a usuarios desde recojo_db (vecino_id, reciclador_id) son
--  REFERENCIAS LÓGICAS (no claves foráneas físicas), por estar en otra base.
--
--  Ejecutar con psql conectado como superusuario:
--      psql -U postgres -f Anexo-B-Script-SQL.sql
--
--  Usuario de prueba: todos los usuarios semilla usan la contraseña  ReciclaPe2026
--  (hash BCrypt, factor 10, compatible con Spring BCryptPasswordEncoder).
-- =============================================================================


-- #############################################################################
-- ##  BASE DE DATOS 1: auth_db  (auth-service)
-- #############################################################################

DROP DATABASE IF EXISTS auth_db;
CREATE DATABASE auth_db WITH ENCODING 'UTF8';

\connect auth_db

-- ---------------------------------------------------------------------------
-- Tabla: rol
-- ---------------------------------------------------------------------------
CREATE TABLE rol (
    id          BIGSERIAL    PRIMARY KEY,
    nombre      VARCHAR(20)  NOT NULL UNIQUE   -- VECINO / RECICLADOR / ADMIN
);

-- ---------------------------------------------------------------------------
-- Tabla: usuario
-- ---------------------------------------------------------------------------
CREATE TABLE usuario (
    id              BIGSERIAL    PRIMARY KEY,
    nombres         VARCHAR(100) NOT NULL,
    apellidos       VARCHAR(100) NOT NULL,
    email           VARCHAR(120) NOT NULL UNIQUE,
    password_hash   VARCHAR(100) NOT NULL,          -- BCrypt
    telefono        VARCHAR(20),
    rol_id          BIGINT       NOT NULL REFERENCES rol(id),
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuario_email  ON usuario(email);
CREATE INDEX idx_usuario_rol    ON usuario(rol_id);

-- ---------------------------------------------------------------------------
-- Datos semilla: roles
-- ---------------------------------------------------------------------------
INSERT INTO rol (nombre) VALUES
    ('VECINO'),
    ('RECICLADOR'),
    ('ADMIN');

-- ---------------------------------------------------------------------------
-- Datos semilla: usuarios  (password de todos = ReciclaPe2026)
-- ---------------------------------------------------------------------------
INSERT INTO usuario (nombres, apellidos, email, password_hash, telefono, rol_id) VALUES
    ('Lucía',   'Quispe Ramos',     'lucia.vecino@reciclape.pe',    '$2b$10$J8VC4FczF/gGhM2OnGT9eeW8gBAczSvrx5WBQc1UVSys6nFkzuRma', '987654321', (SELECT id FROM rol WHERE nombre='VECINO')),
    ('Carlos',  'Huamán Soto',      'carlos.vecino@reciclape.pe',   '$2b$10$J8VC4FczF/gGhM2OnGT9eeW8gBAczSvrx5WBQc1UVSys6nFkzuRma', '987111222', (SELECT id FROM rol WHERE nombre='VECINO')),
    ('Marta',   'Flores Díaz',      'marta.recicla@reciclape.pe',   '$2b$10$J8VC4FczF/gGhM2OnGT9eeW8gBAczSvrx5WBQc1UVSys6nFkzuRma', '987333444', (SELECT id FROM rol WHERE nombre='RECICLADOR')),
    ('Pedro',   'Mamani Cruz',      'pedro.recicla@reciclape.pe',   '$2b$10$J8VC4FczF/gGhM2OnGT9eeW8gBAczSvrx5WBQc1UVSys6nFkzuRma', '987555666', (SELECT id FROM rol WHERE nombre='RECICLADOR')),
    ('Ana',     'Torres Vega',      'admin@reciclape.pe',           '$2b$10$J8VC4FczF/gGhM2OnGT9eeW8gBAczSvrx5WBQc1UVSys6nFkzuRma', '987777888', (SELECT id FROM rol WHERE nombre='ADMIN'));


-- #############################################################################
-- ##  BASE DE DATOS 2: recojo_db  (recojo-service)
-- #############################################################################

DROP DATABASE IF EXISTS recojo_db;
CREATE DATABASE recojo_db WITH ENCODING 'UTF8';

\connect recojo_db

-- ---------------------------------------------------------------------------
-- Tabla: tipo_residuo
-- ---------------------------------------------------------------------------
CREATE TABLE tipo_residuo (
    id              BIGSERIAL     PRIMARY KEY,
    nombre          VARCHAR(60)   NOT NULL UNIQUE,
    descripcion     VARCHAR(200),
    factor_co2_kg   NUMERIC(8,3)  NOT NULL,   -- kg de CO2 evitado por kg reciclado
    precio_kg       NUMERIC(8,2)  NOT NULL DEFAULT 0,
    activo          BOOLEAN       NOT NULL DEFAULT TRUE
);

-- ---------------------------------------------------------------------------
-- Tabla: punto_acopio   (vecino_id => referencia lógica a auth_db.usuario)
-- ---------------------------------------------------------------------------
CREATE TABLE punto_acopio (
    id          BIGSERIAL     PRIMARY KEY,
    vecino_id   BIGINT        NOT NULL,         -- ref lógica auth_db.usuario.id
    direccion   VARCHAR(200)  NOT NULL,
    distrito    VARCHAR(80)   NOT NULL,
    referencia  VARCHAR(200),
    latitud     NUMERIC(10,7),
    longitud    NUMERIC(10,7),
    activo      BOOLEAN       NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_punto_vecino ON punto_acopio(vecino_id);

-- ---------------------------------------------------------------------------
-- Tabla: recojo
-- ---------------------------------------------------------------------------
CREATE TABLE recojo (
    id               BIGSERIAL    PRIMARY KEY,
    punto_acopio_id  BIGINT       NOT NULL REFERENCES punto_acopio(id),
    vecino_id        BIGINT       NOT NULL,     -- ref lógica auth_db.usuario.id
    reciclador_id    BIGINT,                    -- ref lógica auth_db.usuario.id (null hasta aceptar)
    estado           VARCHAR(15)  NOT NULL DEFAULT 'SOLICITADO'
                     CHECK (estado IN ('SOLICITADO','ACEPTADO','COMPLETADO','CANCELADO')),
    fecha_solicitud  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_recojo     TIMESTAMP,
    observacion      VARCHAR(250)
);

CREATE INDEX idx_recojo_estado     ON recojo(estado);
CREATE INDEX idx_recojo_vecino     ON recojo(vecino_id);
CREATE INDEX idx_recojo_reciclador ON recojo(reciclador_id);

-- ---------------------------------------------------------------------------
-- Tabla: detalle_recojo
-- ---------------------------------------------------------------------------
CREATE TABLE detalle_recojo (
    id               BIGSERIAL     PRIMARY KEY,
    recojo_id        BIGINT        NOT NULL REFERENCES recojo(id) ON DELETE CASCADE,
    tipo_residuo_id  BIGINT        NOT NULL REFERENCES tipo_residuo(id),
    kilogramos       NUMERIC(10,2) NOT NULL CHECK (kilogramos > 0),
    co2_evitado      NUMERIC(10,3) NOT NULL DEFAULT 0
);

CREATE INDEX idx_detalle_recojo ON detalle_recojo(recojo_id);

-- ---------------------------------------------------------------------------
-- Datos semilla: tipos de residuo (factores de CO2 referenciales)
-- ---------------------------------------------------------------------------
INSERT INTO tipo_residuo (nombre, descripcion, factor_co2_kg, precio_kg) VALUES
    ('Papel',        'Papel blanco y de oficina',          0.900, 0.50),
    ('Cartón',       'Cajas y empaques de cartón',         0.800, 0.40),
    ('Plástico PET', 'Botellas PET transparentes',         1.500, 0.80),
    ('Vidrio',       'Botellas y frascos de vidrio',       0.300, 0.20),
    ('Metal',        'Latas de aluminio y chatarra',       2.000, 1.20);

-- ---------------------------------------------------------------------------
-- Datos semilla: puntos de acopio (vecino_id 1 y 2 de auth_db)
-- ---------------------------------------------------------------------------
INSERT INTO punto_acopio (vecino_id, direccion, distrito, referencia, latitud, longitud) VALUES
    (1, 'Av. Pardo 123, Dpto 401', 'Miraflores', 'Frente al parque Kennedy', -12.121500, -77.029700),
    (1, 'Calle Lima 456',          'Miraflores', 'Edificio azul',            -12.118000, -77.031000),
    (2, 'Jr. Berlín 789',          'Miraflores', 'Esquina con grifo',        -12.123400, -77.028100);

-- ---------------------------------------------------------------------------
-- Datos semilla: recojos en distintos estados
-- ---------------------------------------------------------------------------
-- Recojo COMPLETADO (vecino 1, reciclador 3)
INSERT INTO recojo (punto_acopio_id, vecino_id, reciclador_id, estado, fecha_solicitud, fecha_recojo, observacion)
VALUES (1, 1, 3, 'COMPLETADO', '2026-05-20 09:00:00', '2026-05-20 15:30:00', 'Entregado en buen estado');

-- Recojo ACEPTADO (vecino 2, reciclador 4)
INSERT INTO recojo (punto_acopio_id, vecino_id, reciclador_id, estado, fecha_solicitud, observacion)
VALUES (3, 2, 4, 'ACEPTADO', '2026-05-28 10:15:00', 'Programado para el fin de semana');

-- Recojo SOLICITADO (vecino 1, sin reciclador)
INSERT INTO recojo (punto_acopio_id, vecino_id, estado, fecha_solicitud)
VALUES (2, 1, 'SOLICITADO', '2026-06-01 08:00:00');

-- ---------------------------------------------------------------------------
-- Datos semilla: detalles del recojo COMPLETADO (id = 1)
-- co2_evitado = kilogramos * factor_co2_kg del tipo
-- ---------------------------------------------------------------------------
INSERT INTO detalle_recojo (recojo_id, tipo_residuo_id, kilogramos, co2_evitado) VALUES
    (1, (SELECT id FROM tipo_residuo WHERE nombre='Papel'),        5.00,  4.500),
    (1, (SELECT id FROM tipo_residuo WHERE nombre='Plástico PET'), 3.00,  4.500),
    (1, (SELECT id FROM tipo_residuo WHERE nombre='Vidrio'),       8.00,  2.400);

-- =============================================================================
-- Consultas de verificación (opcionales)
-- =============================================================================
-- SELECT u.nombres, r.nombre AS rol FROM usuario u JOIN rol r ON r.id = u.rol_id;   -- en auth_db
-- SELECT estado, COUNT(*) FROM recojo GROUP BY estado;                              -- en recojo_db
-- SELECT SUM(co2_evitado) AS co2_total, SUM(kilogramos) AS kg_total FROM detalle_recojo;
-- =============================================================================
