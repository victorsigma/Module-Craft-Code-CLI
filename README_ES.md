![MCCC Banner](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/banner-mccc.png)

# Module Craft Code CLI (MCCC)
> ⚡ CLI rápida para desarrollo de Add-Ons en Minecraft Bedrock

## 🚀 ¿Qué es MCCC?

**MCCC** es una herramienta CLI que te ayuda a **crear Add-Ons para Minecraft Bedrock más rápido** generando archivos estructurados, componentes y elementos de forma automática.

⚡ Reduce la configuración repetitiva  
⚡ Genera entidades, bloques e ítems al instante  
⚡ Mantén una estructura de proyecto limpia y escalable  

> Diseñado para creadores de Minecraft que quieren moverse más rápido y enfocarse en el gameplay.

[![NPM](https://img.shields.io/npm/v/module-craft-code-cli?color=blue&label=Module%20Craft%20Code%20CLI)](https://www.npmjs.com/package/module-craft-code-cli)
![Node.js](https://img.shields.io/badge/node-%3E%3D22.12.0-339933?logo=node.js&logoColor=white)

[![GitHub tags](https://img.shields.io/github/tag/victorsigma/module-craft-code-cli?color=blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/tags)
[![GitHub stars](https://img.shields.io/github/stars/victorsigma/module-craft-code-cli?color=blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/stargazers)

[![Readme EN](https://img.shields.io/badge/readme-english-blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/blob/main/README.md)



## 📦 Instalación

```bash
npm install -g module-craft-code-cli
```
![Demo de instalación](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/install.gif)

## ⚡ Inicio Rápido

> Nota: El namespace se infiere automáticamente de la configuración del proyecto.  
> Si existen múltiples namespaces, se te pedirá que elijas uno.

**1. Inicializar un nuevo proyecto Add-On (Behavior Pack)**
```bash
mccc init -n "Magic Creatures" -s "magicre"
```
![Demo de inicialización](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/init.gif)

**2. Generar un bloque personalizado**
```bash
mccc generate element block -n "mystical_slab" -p "slab" -m true
```
![Demo de generación de bloque](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/block.gif)

**3. Generar una entidad personalizada**
```bash
mccc generate element entity -n "unicorn" -e false -sp true -su true
```
![Demo de generación de entidad](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/entity.gif)

## 🧱 Ejemplo de Salida

> Nota: Los archivos se agrupan por namespace (ej. `magicre`) para evitar conflictos  
> y soportar proyectos con múltiples namespaces.

Después de ejecutar los comandos anteriores, la estructura de tu proyecto se verá así:

```bash
magiccreatures_bp/
├── blocks/
│   └── magicre/
│       └── mystical_slab.json
├── entities/
│   └── magicre/
│       └── unicorn.json
└── addon.properties
```

## 📋 Comandos

| Comando | Alias | Descripción |
|---|---|---|
| `mccc init` | `mccc i` | Inicializa un nuevo proyecto Add-On |
| `mccc setting` | `mccc s` | Configura ajustes globales del CLI |
| `mccc generate component block` | `mccc g c block` | Genera un componente personalizado para bloque |
| `mccc generate component item` | `mccc g c item` | Genera un componente personalizado para ítem |
| `mccc generate common lang` | `mccc g cm lang` | Genera un archivo de idioma |
| `mccc generate common manifest` | `mccc g cm manifest` | Genera un manifest.json |
| `mccc generate common library` | `mccc g cm library` | Genera una librería |
| `mccc generate common icon` | `mccc g cm icon` | Establece el ícono del proyecto |
| `mccc generate common model` | `mccc g cm model` | Genera un archivo de modelo |
| `mccc generate element entity` | `mccc g e entity` | Genera un objeto de entidad |
| `mccc generate element item` | `mccc g e item` | Genera un objeto ítem |
| `mccc generate element block` | `mccc g e block` | Genera un objeto de bloque |


## Init

Inicializa el proyecto con un archivo `addon.properties`.

```shell
mccc init [opciones]

mccc i [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el nombre del Add-On (por defecto: `"Nuevo Addon"`).
> * `-s, --namespace <string>`: Especifica el namespace del Add-On (por defecto: `"namespace"`).
> * `-d, --description <string>`: Especifica la descripción del Add-On (por defecto: `"Descripción del Addon"`).
> * `-t, --type <string>`: Especifica el tipo de proyecto (por defecto: `"behavior"`). Opciones: `behavior`, `resource`, `skin`.

## Setting

Establece configuraciones globales para el CLI.

```shell
mccc setting [opciones]

mccc s [opciones]
```

Opciones
> * `-l, --lang <string>`: Especifica el idioma del programa. Opciones: `"es"`, `"en"`.


## Generate

Genera componentes personalizados, elementos y archivos comunes del proyecto.

```shell
mccc generate [comando] [opciones]

mccc g [comando] [opciones]
```

Subcomandos
> * `component`: Genera un componente personalizado.
> * `common`: Genera archivos comunes como `lang`, `manifest`, `library`, `icon`, `model`.
> * `element`: Genera objetos de tipo `entity`, `item`, `block`.


## Component

Genera un componente personalizado.

```shell
mccc generate component [comando] [opciones]

mccc g c [comando] [opciones]
```

Subcomandos
> * `block`: Crea un componente personalizado para un bloque.
> * `item`: Crea un componente personalizado para un ítem.

Opciones
> * `-n, --name <string>`: Especifica el nombre del componente (por defecto: `"namespace:component"`).
> * `-d, --description <string>`: Especifica la descripción del componente (por defecto: `"description"`).
> * `-p, --prefab <string>`: Especifica el prefab que utilizará el componente (por defecto: `"none"`). Opciones: `none`, `slab`.

### Block

Crea un componente personalizado para un bloque.

```shell
mccc generate component block [opciones]

mccc g c block [opciones]
```

### Item

Crea un componente personalizado para un ítem.

```shell
mccc generate component item [opciones]

mccc g c item [opciones]
```



## Common

Genera archivos comunes.

```shell
mccc generate common [comando] [opciones]

mccc g cm [comando] [opciones]
```

Subcomandos
> * `lang`: Genera un archivo de idioma.
> * `manifest`: Genera un manifest.
> * `library`: Genera una librería.
> * `icon`: Establece un ícono genérico para tu proyecto.
> * `model`: Genera un archivo de modelo.



### Lang

Genera un archivo de idioma.

```shell
mccc generate common lang [opciones]

mccc g cm lang [opciones]
```

Opciones
> * `-r, --region <string>`: Especifica la región para la localización de idioma.


### Manifest

Genera un archivo `manifest.json`.

```shell
mccc generate common manifest [opciones]

mccc g cm manifest [opciones]
```

Opciones
> * `-l, --link <string>`: Vincula un resource_pack con un behavior_pack.
> * `-s, --scripts <boolean>`: Habilita los scripts en un behavior_pack.
> * `-c, --capabilities <boolean>`: Habilita las capacidades en un resource_pack.


### Library

Genera una librería.

```shell
mccc generate common library [opciones]

mccc g cm library [opciones]
```

Opciones
> * `-m, --module <string>`: Especifica la librería a agregar. Opciones: `bedrockSystem`, `blockManager`, `itemManager`.


### Icon

Establece un ícono genérico para tu proyecto.

```shell
mccc generate common icon [opciones]

mccc g cm icon [opciones]
```

Opciones
> * `-r, --random <boolean>`: Habilita la selección aleatoria de íconos (por defecto: `false`).


### Model

Genera un archivo de modelo.

```shell
mccc generate common model [opciones]

mccc g cm mo [opciones]
```

Opciones
> * `-t, --type <string>`: Especifica el tipo de modelo a crear - Solo resource pack (por defecto: `"slab"`). Opciones: `slab`, `stair`, `fence`.


## Element

Genera objetos de tipo `entity`, `item`, `block`.

```shell
mccc generate element [comando] [opciones]

mccc g e [comando] [opciones]
```

Subcomandos

> * `entity`: Genera un objeto de entidad.
> * `item`: Genera un objeto ítem.
> * `block`: Genera un objeto de bloque.


### Entity

Genera un objeto de entidad.

```shell
mccc generate element entity [opciones]

mccc g e entity [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el identificador de la entidad (por defecto: `"namespace:entity"`).
> * `-r, --runtime <string>`: Establece el identificador de Vanilla Minecraft que esta entidad utilizará para construirse.
> * `-e, --experimental <boolean>`: Especifica si la entidad usará características experimentales de Minecraft (por defecto: `false`).
> * `-sp, --spawnable <boolean>`: Especifica si el huevo generador de la entidad aparecerá en el inventario creativo (por defecto: `false`).
> * `-su, --summonable <boolean>`: Especifica si la entidad puede ser invocada mediante comandos en el juego (por defecto: `false`).


### Item

Genera un objeto ítem.

```shell
mccc generate element item [opciones]

mccc g e item [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el identificador del ítem (por defecto: `"namespace:item"`).
> * `-t, --type <string>`: Especifica el tipo de ítem a crear (por defecto: `"item"`). Opciones: `item`, `axe`, `pickaxe`, `shovel`, `slab`, `sword`.
> * `-m, --menu <boolean>`: Indica si el ítem tendrá una sección personalizada en el menú de Minecraft (por defecto: `false`).


### Block

Genera un objeto de bloque.

```shell
mccc generate element block [opciones]

mccc g e block [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el identificador del bloque (por defecto: `"namespace:block"`).
> * `-p, --prefab <string>`: Especifica el prefab que utilizará el bloque (por defecto: `"block"`). Opciones: `block`, `slab`, `stair`, `fence`.
> * `-m, --menu <boolean>`: Indica si el bloque tendrá una sección personalizada en el menú de Minecraft (por defecto: `false`).
> * `-l, --liquid <boolean>`: Define cómo se comporta el bloque al detectar un líquido (por defecto: `false`).
> * `-r, --render <string>`: Define el material de textura del bloque (por defecto: `"opaque"`). Opciones: `opaque`, `double_sided`, `blend`, `alpha_test`.