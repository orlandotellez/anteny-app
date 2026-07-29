# Anteny App

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1C1E24?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Aplicacion de mensajeria movil basada en el protocolo Matrix, construida con React Native (Expo) y Synapse como servidor de backend.

## Descripcion

Anteny App es un cliente de mensajeria que utiliza el protocolo Matrix para la comunicacion descentralizada. La aplicacion permite enviar mensajes, gestionar conversaciones, compartir multimedia y mantener presencia en tiempo real, todo sobre una infraestructura auto-hospedada mediante Synapse.

## Estructura del proyecto

El repositorio se organiza en dos componentes principales:

### `anteny-app/`

Aplicacion movil desarrollada con Expo (React Native) que funciona en Android, iOS y web.

```
anteny-app/
  app/              # Navegacion (Expo Router, file-based)
    (auth)/         # Pantallas de autenticacion (login, registro)
    (tabs)/         # Navegacion principal con tabs (chats, contactos, ajustes)
    [chatId]/       # Pantallas de conversacion (mensajes, perfil, media, busqueda)
    contacts/       # Perfil de contacto
    modal/          # Modales globales
    _layout.tsx     # Layout raiz con providers globales

  src/
    features/       # Logica de negocio organizada por funcionalidad
      auth/         # Autenticacion (contexto, login, registro)
      chats/        # Lista de conversaciones
      contacts/     # Contactos
      profile/      # Perfiles de usuario
      messages/     # Mensajes dentro del chat
      media/        # Archivos compartidos
      presence/     # Estado online y typing

    services/
      matrix/       # Cliente API de Matrix (auth, rooms, messages, sync, timeline, users, profile)

    shared/         # Codigo reutilizable
      components/   # Componentes de UI comunes
      constants/    # Constantes de entorno
      lib/          # Tema y utilerias
      types/        # Tipos de TypeScript
      utils/        # Funciones auxiliares

    guards/         # Guardian de autenticacion (AuthGuard)
    hooks/          # Hooks globales (sync loop, room messages)
    storage/        # Almacenamiento local (auth, profile)
    styles/         # Estilos organizados por seccion
```

### `matrix-synapse/`

Despliegue local del servidor Matrix Synapse con PostgreSQL, orquestado con Docker Compose.

```
matrix-synapse/
  docker-compose.yml    # Servicios: synapse + postgres
  homeserver.yaml.example
  postgres/             # Datos persistentes de PostgreSQL
  data/                 # Datos persistentes de Synapse
```

## Tecnologias

### Frontend
- React 19 con React Native 0.81
- Expo SDK 54
- Expo Router para navegacion file-based
- TypeScript 5.9
- react-native-safe-area-context
- react-native-screens
- expo-secure-store para almacenamiento seguro de tokens

### Backend (infraestructura local)
- Matrix Synapse (servidor de mensajeria)
- PostgreSQL 15
- Docker Compose

### Arquitectura
- Navegacion desacoplada de la logica de negocio (app/ solo contiene rutas)
- Organizacion por funcionalidades (features/)
- Capa de servicios para el protocolo Matrix
- Path alias `@/` para imports absolutos

## Requisitos previos

- Node.js 18 o superior
- pnpm (recomendado) o npm
- Expo CLI
- Docker y Docker Compose (para el servidor Synapse)
- Android Studio o Xcode (para ejecutar en dispositivos/emuladores)

## Configuracion e instalacion

### 1. Servidor Matrix Synapse

```bash
cd matrix-synapse

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# Generar configuracion de homeserver (primer inicio)
docker-compose run --rm synapse generate

# Iniciar los servicios
docker-compose up -d
```

### 2. Aplicacion movil

```bash
cd anteny-app

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con la URL y puerto del servidor Matrix

# Instalar dependencias
pnpm install

# Iniciar en web (desarrollo rapido)
pnpm web

# Iniciar en Android
pnpm android

# Iniciar en iOS
pnpm ios
```

## Variables de entorno

### `anteny-app/.env`

| Variable             | Descripcion                          |
|----------------------|--------------------------------------|
| MATRIX_PORT          | Puerto del servidor Synapse          |
| MATRIX_HOST_SERVER   | IP del servidor Synapse              |
| MATRIX_URL           | URL completa del servidor            |
| APP_ENV              | Entorno (development, production)    |
| JWT_SECRET           | Secreto para JWT                     |

### `matrix-synapse/.env`

| Variable                   | Descripcion                      |
|----------------------------|----------------------------------|
| POSTGRES_USER              | Usuario de PostgreSQL            |
| POSTGRES_PASSWORD          | Contrasena de PostgreSQL         |
| POSTGRES_DB                | Nombre de la base de datos       |
| SYNAPSE_SERVER_NAME        | Nombre del servidor Synapse      |
| REGISTRATION_SHARED_SECRET | Secreto compartido de registro   |
| MACAROON_SECRET_KEY        | Clave secreta de macaroon        |
| FORM_SECRET                | Secreto de formularios           |

## Licencia

MIT
