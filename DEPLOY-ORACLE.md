# Desplegar ReciclaPe en Oracle Cloud (gratis)

Guía para publicar todo el proyecto en línea usando una máquina virtual **Always Free** de
Oracle Cloud y `docker compose`. Queda en una sola URL, con un solo comando de arranque.

**Qué obtienes:** `http://TU_IP` (o `https://tu-dominio` si haces el paso opcional) con la app
completa: frontend Angular + los 5 microservicios + PostgreSQL + RabbitMQ.

---

## Requisitos
- Una cuenta de Oracle Cloud (el registro pide una tarjeta solo para verificar; la VM es gratis para siempre).
- Cliente SSH (en Windows: PowerShell ya trae `ssh`).

---

## Paso 1 — Crear la máquina virtual
1. Entra a <https://cloud.oracle.com> → menú **Compute → Instances → Create instance**.
2. **Image and shape** → *Edit*:
   - **Image:** Canonical **Ubuntu 22.04**.
   - **Shape:** *Ampere* → **VM.Standard.A1.Flex** → asigna **2 OCPU y 12 GB de RAM** (entra en el Always Free).
3. **Networking:** deja que cree una VCN nueva y **asigna una IP pública**.
4. **Add SSH keys:** *Generate a key pair for me* y **descarga la llave privada** (la usarás para conectarte).
5. **Create**. Cuando termine, anota la **Public IP address**.

## Paso 2 — Abrir los puertos 80 y 443
Hay que abrirlos en **dos** lugares.

**a) En la red de Oracle (VCN):**
- Instances → tu instancia → *Virtual Cloud Network* → *Security Lists* → *Default Security List* → **Add Ingress Rules**:
  - Source `0.0.0.0/0`, IP Protocol `TCP`, Destination Port `80`.
  - Otra regla igual para el puerto `443`.

**b) En el firewall del sistema (más adelante, dentro de la VM por SSH):** ver Paso 4.

## Paso 3 — Conectarte por SSH
Desde tu PC (ajusta la ruta de la llave y la IP):
```bash
ssh -i ruta/a/tu-llave.key ubuntu@TU_IP
```

## Paso 4 — Preparar la VM (Docker + firewall)
Ya dentro de la VM, ejecuta:
```bash
# Abrir 80 y 443 en el firewall de Ubuntu (Oracle los bloquea por defecto)
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save

# Instalar Docker (incluye docker compose)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker   # aplica el grupo sin tener que reconectar
```

## Paso 5 — Descargar el proyecto y configurarlo
```bash
git clone https://github.com/Rumitche24P/ReciclaPe.git
cd ReciclaPe/infra
cp .env.example .env
nano .env        # cambia POSTGRES_PASSWORD y JWT_SECRET (deja SITE_ADDRESS=:80 por ahora)
```
Guarda en nano con `Ctrl+O`, `Enter`, y sal con `Ctrl+X`.

## Paso 6 — Levantar todo
```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```
La primera vez compila las imágenes (unos 5–10 minutos en ARM). Para ver el avance:
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f api-gateway
```

## Paso 7 — Probar
Abre en el navegador: **`http://TU_IP`**

Usuario de prueba: **admin@reciclape.pe** / **ReciclaPe2026**
(también `lucia.vecino@reciclape.pe` y `marta.recicla@reciclape.pe`).

---

## Paso 8 (opcional) — HTTPS gratis con un dominio
Para tener `https://` y una URL bonita en vez de la IP:
1. Crea una cuenta en <https://www.duckdns.org> (entra con Google/GitHub).
2. Crea un subdominio, por ejemplo `reciclape`, y en *current ip* pon la **IP pública** de tu VM. Quedará `reciclape.duckdns.org`.
3. En la VM:
   ```bash
   cd ~/ReciclaPe/infra
   nano .env        # cambia:  SITE_ADDRESS=reciclape.duckdns.org
   docker compose -f docker-compose.prod.yml --env-file .env up -d
   ```
4. Caddy obtiene el certificado solo. Abre **`https://reciclape.duckdns.org`**.

---

## Comandos útiles
```bash
# Estado de los contenedores
docker compose -f docker-compose.prod.yml ps

# Ver logs de un servicio
docker compose -f docker-compose.prod.yml logs -f recojo-service

# Actualizar tras un cambio en GitHub
git pull && docker compose -f docker-compose.prod.yml --env-file .env up -d --build

# Apagar todo (sin borrar datos)
docker compose -f docker-compose.prod.yml down

# Apagar y borrar también la base de datos
docker compose -f docker-compose.prod.yml down -v
```

## Notas
- La VM Always Free (2 OCPU / 12 GB) sobra para este stack.
- Es arquitectura ARM; todas las imágenes usadas son compatibles, no hay que cambiar nada.
- Solo Caddy expone puertos (80/443); el resto de servicios queda en la red interna, no accesibles desde fuera.
- Mantén la VM encendida durante la presentación; si la apagas, vuelve a entrar y `docker compose ... up -d`.
