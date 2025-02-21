# Phily - Visualizador de arboles filogenéticos


## Primeros pasos

Es necesario para la ejecución de este proyecto revisar los siguientes puntos a continuación, tanto para su ejecución de manera local, ambiente de pruebas o produción.


### Requisitos de runtime
- node.js >= 20.12.1
- bun.js >= 1.2.0

### Comandos de instalación 

```bash
npm install
# ó
bun install
```

### cómandos de ejecución de preubas

```bash
npm run dev
# ó
bun dev
```

#### Comandos de construiccion de proyecto

```bash
npm run build
# ó
bun run build

```

## Secretos del proyecto

Para el proyecto solo se necesitan los descritos en los .env ya agregados dentro del mismo, si se requiere agregar por favor documentar y extender este espacio

```sh

PORT=3000
ENVIRONMENT=development
ANALYZE=true

```

## Construccion del proyecto

Se ha dejado como base un archivo de Docker dentro del espacio de docker y un archivo de formato Docker-compose. un ejemplo sencillo para poder construir la imagen con docker utilizando docker-compose es el siguiente:

```bash
docker-compose -f 'docker-compose.yml' up -d --build 
```

### Contribución

Para contruibuir a este proyecto contactarse con
* [Manuel Villalobos Cid](mailto:manuel.villalobos@usach.cl)
* [Rodrigo Mardones Aguilar](mailto:rodrigo.mardones.a@usach.cl)

### Licencia

El proyecto tiene una licencia generica de Creative Commons (Attribution-ShareAlike 4.0 International
) descrita [aquí](LICENSE).
