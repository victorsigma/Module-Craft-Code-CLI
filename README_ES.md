# Module Craft Code CLI

### CLI versátil para generar y gestionar módulos, componentes, eventos y archivos de configuración en proyectos de Minecraft.

[![NPM](https://img.shields.io/npm/v/module-craft-code-cli?color=blue&label=Module%20Craft%20Code%20CLI)](https://www.npmjs.com/package/module-craft-code-cli)
[![GitHub tags](https://img.shields.io/github/tag/victorsigma/module-craft-code-cli?color=blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/tags)

[![Readme EN](https://img.shields.io/badge/readme-english-blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/blob/main/README.md)
[![GitHub stars](https://img.shields.io/github/stars/victorsigma/module-craft-code-cli?color=blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/stargazers)



### Comandos

## Init

Inicializa el proyecto con un archivo `addon.properties`.

```shell
mccc init [opciones]

mccc i [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el nombre del addon (por defecto: `"New Addon"`).
> * `-s, --namespace <string>`: Especifica el namespace del addon (por defecto: `"namespace"`).
> * `-d, --description <string>`: Especifica la descripción del addon (por defecto: `"Addon Description"`).
> * `-t, --type <string>`: Especifica el tipo de proyecto (por defecto: `"behavior"`). Opciones: `behavior`, `resource`, `skin`.

## Setting

Establece configuraciones globales para el CLI.

```shell
mccc setting [opciones]

mccc s [opciones]
```

Opciones
> * `-l, --lang <string>`: Especifica el idioma del programa. Opciones: `"es"`, `"es"`.


## Generate

Genera componentes personalizados, elementos y bloques.

```shell
mccc generate [comando] [opciones]

mccc g [comando] [opciones]
```

Subcomandos
> * `component`: Genera un componente personalizado.
> * `common`: Genera archivos comunes como `lang`, `manifest`, `library`, `icon`.
> * `element`: Genera objetos de tipo `entity`, `item`, `block`.


## Component

Genera un componente personalizado.

```shell
mccc generate component [comando] [opciones]

mccc g c [comando] [opciones]
```

Subcomandos
> * `block`: Crea un componente personalizado para un bloque.
> * `item`: Crea un componente personalizado para un item.

Opciones
> * `-n, --name <string>`: Especifica el nombre del componente (por defecto: `"namespace:component"`).
> * `-d, --description <string>`: Especifica la descripción del componente (por defecto: `"description`").


### Block

Crea un componente personalizado para un bloque.

```shell
mccc generate component block [opciones]

mccc g c block [opciones]
```

### Item

Crea un componente personalizado para un item.

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
> * `manifest`: Genera un archivo manifest.
> * `library`: Genera una librería.
> * `icon`: Establece un icono genérico para tu proyecto.



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
> * `-m, --module <string>`: Especifica la librería que se va a agregar. Opciones: `bedrockSystem`, `blockManager`, `itemManager`.


### Icon

Establece un icono genérico para tu proyecto.

```shell
mccc generate common icon [opciones]

mccc g cm icon [opciones]
```

Opciones
> * `-r, --random <boolean>`: Habilita la selección aleatoria de íconos (por defecto: `false`).


## Element

Genera objetos de tipo `entity`, `item`, `block`.

```shell
mccc generate element [comando] [opciones]

mccc g e [comando] [opciones]
```

Subcomandos

> * `entity`: Genera un objeto de entidad.
> * `item`: Genera un objeto item.
> * `block`: Genera un objeto de bloque.


### Entity

Genera un objeto de entidad.

```shell
mccc generate element entity [opciones]

mccc g e entity [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el identificador de la entidad (por defecto: `"namespace:entity"`).
> * `-r, --runtime <string>`: Establece el identificador de Vanilla Minecraft que esta entidad utilizará para construirse a sí misma.
> * `-e, --experimental <boolean>`: Especifica si la entidad estará bajo características experimentales de Minecraft (por defecto: `false`).
> * `-sp, --spawnable <boolean>`: Especifica si el generador de la entidad aparecerá en el inventario de creativo (por defecto: `false`).
> * `-su, --summonable <boolean>`: Especifica si la entidad puede ser invocada mediante comandos en el juego (por defecto: `false`).


### Item

Genera un objeto item.

```shell
mccc generate element item [opciones]

mccc g e item [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el identificador del item (por defecto: `"namespace:item"`).
> * `-t, --type <string>`: Especifica el tipo de item a crear (por defecto: `"item"`). Opciones: `item`, `axe`, `pickaxe`, `shovel`, `sword`.
> * `-m, --menu <boolean>`: Indica si el item tendrá una sección personalizada en el menú de Minecraft (por defecto: `false`).


### Block

Genera un objeto de bloque.

```shell
mccc generate element block [opciones]

mccc g e block [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el identificador del bloque (por defecto: `"namespace:block"`).
> * `-m, --menu <boolean>`: Indica si el bloque tendrá una sección personalizada en el menú de Minecraft (por defecto: `false`).
> * `-l, --liquid <boolean>`: Define cómo se comporta un bloque al detectar un líquido (por defecto: `false`).
> * `-r, --render <string>`: Define el material de la textura del bloque (por defecto: `"opaque"`). Opciones: `opaque`, `double_sided`, `blend`, `alpha_test`.