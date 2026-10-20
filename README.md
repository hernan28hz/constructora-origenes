# Orígenes · Constructora e Inmobiliaria

Sitio web de Orígenes, constructora e inmobiliaria: lotes, terrenos e infraestructura vial.

Hecho con Next.js, React y TypeScript.

## Requisitos

- [Node.js](https://nodejs.org) 20.9 o superior (se recomienda la versión LTS).

Para saber si ya lo tienes, escribe `node -v` en una terminal. Si aparece un número como `v24.14.0`, ya está instalado.

## Ejecutar la web por primera vez

Abre una terminal (en VS Code: menú **Terminal → Nueva terminal**) y pega estos comandos:

```powershell
cd C:\dev\constructora
npm install
npm run dev
```

- `cd C:\dev\constructora` entra a la carpeta del proyecto.
- `npm install` descarga lo que necesita la web. Solo hace falta la primera vez, o cuando cambien las dependencias del proyecto.
- `npm run dev` enciende la web.

## Ejecutar la web las siguientes veces

```powershell

npm run dev
```

## Ver la web

Cuando la terminal muestre esto, la web está funcionando:

```
▲ Next.js 16.4.2 (Turbopack)
- Local:         http://localhost:3000
✓ Ready in 1s
```

Abre **http://localhost:3000** en el navegador. 
Mientras la terminal siga abierta, la web se actualiza sola cada vez que guardas un cambio.

## Apagar la web

En la terminal donde está corriendo, presiona **Ctrl + C**.

## Si algo falla

- **«El puerto 3000 está en uso»**: la web ya está encendida en otra terminal. Ciérrala con Ctrl + C, o abre directamente http://localhost:3000.
- **«La ejecución de scripts está deshabilitada en este sistema»**: ejecuta esto una sola vez en PowerShell y vuelve a intentarlo:

  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```

## Secuencia de imágenes del hero

La animación de la casa usa los fotogramas de `public/media/scrollytelling/frames_timelapse_house` (originales, no se tocan). Si cambias esos fotogramas, genera de nuevo las versiones ligeras con:

```powershell
node scripts/optimize-sequence.mjs
```

Luego actualiza la cantidad de fotogramas en `heroSequence` (`src/content/site.ts`).
