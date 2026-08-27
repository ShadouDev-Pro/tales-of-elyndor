# Tales of Elyndor

![Status](https://img.shields.io/badge/status-En%20desarrollo-orange?style=flat-square)
![License](https://img.shields.io/badge/license-GPLv3-blue?style=flat-square&logo=gnu&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-v4.19.2-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-v19.2.8-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-v8.2.2-646CFF?style=flat-square&logo=vite&logoColor=white)
![npm workspaces](https://img.shields.io/badge/npm%20workspaces-enabled-CB3837?style=flat-square&logo=npm&logoColor=white)

Juego web indie narrativo de simulación de vida en un mundo de fantasía medieval.
El personaje no elige una clase: se convierte en lo que su vida le lleva a ser.

Descripción técnica: este repositorio es el punto de partida técnico del
proyecto y está diseñado para crecer de forma incremental. No pretende
implementar todo el documento de diseño desde el inicio; la idea es añadir
sistemas gradualmente (infancia, tiempo, magia, sociedad...) sobre una base
sólida y reutilizable.

## Contenido rápido

- **Estado:** En desarrollo — Prototipo monorepo con datos compartidos, backend mínimo y frontend.
- **Stack:** Node.js (Express), React + Vite, npm workspaces.
- **Formato:** Código modular para evitar duplicación entre backend y frontend.

## Tabla de contenidos

- [Estructura (monorepo con npm workspaces)](#estructura-monorepo-con-npm-workspaces)
- [Arrancar en local](#arrancar-en-local)
- [Qué ya está y qué falta](#qué-ya-está-y-qué-falta)
- [Notas de diseño](#notas-de-diseño)

## Estructura (monorepo con npm workspaces)

```
tales-of-elyndor/
├── packages/
│   ├── shared/      # Datos y lógica de dominio compartidos (razas, atributos, personajes)
│   ├── backend/     # API REST en Express (Node, ESM)
│   └── frontend/    # App en React + Vite (JavaScript)
└── package.json     # Raíz del workspace
```

- **`packages/shared`** es la fuente de verdad del "diseño del juego" en
  código: razas (`races.js`), atributos fundamentales (`attributes.js`) y una
  factoría de personajes (`character.js`) que los combina. Tanto el backend
  como el frontend importan de aquí, así+que un dato nunca se duplica.

- **`packages/backend`** expone una API REST mínima:
  - `GET /api/races` (usa `?playable=true` para excluir razas no jugables como los dragones)
  - `GET /api/races/:id`
  - `GET /api/attributes`
  - `GET /api/characters` / `POST /api/characters` (almacenamiento en memoria, temporal)

- **`packages/frontend`** es una interfaz muy simple para explorar razas,
  atributos y generar un personaje de prueba contra la API.

## Arrancar en local

Requisitos previos: `node` (v14+) y `npm`.

Instalación y ejecución rápida:

```bash
npm install       # instala todo el workspace (raíz + los 3 paquetes)
npm run dev       # arranca backend (puerto 3001) y frontend (puerto 5173) a la vez
```

También puedes arrancarlos por separado con `npm run dev:backend` y
`npm run dev:frontend`.

## Qué ya está y qué falta

Ya incluido, según el documento de diseño:

- Las 9 razas jugables (sección 5) + dragones como no jugables (sección 4.2).
- Los 6 atributos fundamentales con `actual` y `potencial` (sección 9.1 y 9.3).
- Afinidades raciales suaves sobre el potencial de atributos (sección 10.14,
  adaptado a atributos en vez de a magia) — son valores de partida
  orientativos, pensados para ajustarse con el tiempo.

Deliberadamente fuera todavía (para ir decidiéndolo con calma):

- Persistencia real (hoy los personajes viven solo en memoria del backend).
- Sistema de habilidades, rasgos, personalidad, origen e infancia.
- Sistema temporal, magia, sociedades y el resto de sistemas del documento.

## Notas de diseño

El documento de diseño completo vive fuera de este repo por ahora; esta
estructura de código es una interpretación práctica de las secciones de
razas y atributos, no una traducción literal — algunos valores numéricos
(años de madurez, esperanza de vida, bonificaciones de afinidad) son
estimaciones de partida que el propio documento no fija con exactitud.

---

Si quieres, puedo:

- Añadir una captura o mock visual en `public/` para mejorar la cabecera.
- Generar scripts `npm` para facilitar pruebas automáticas.
- Formatear el `package.json` raíz para añadir badges reales (CI, cobertura).

Indícame cuál de estos siguientes pasos prefieres y lo implemento.
