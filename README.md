# YOLA OS — tu universo, una sola cuenta

**YOLA** es un sistema operativo personal, vivo, que corre en tu navegador.
Este repositorio es el **deploy público** del YOLA OS (escritorio web SolidJS).

> Probar en vivo: https://www.yolabysayri.com/hola-yola/

## Arquitectura

- **yola-daemon** (Rust): motor — browser, voz, memoria, procesos
- **yola-agent-runtime** (Rust): bridge HTTP/SSE entre daemon y UI
- **si-yola**: el YOLA OS — escritorio web (esta carpeta es su build)
- **yola-desktop** (Tauri): doble clic → YOLA viva
- **yola-sunat**: facturación electrónica SUNAT local-first

## Data

- 100% local (SQLite + tus archivos). Nunca en la nube.
- Providers: trae tu API key (OpenAI, Anthropic, Google, local...).
