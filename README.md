# Module Craft Code CLI

### Versatile CLI for generating and managing modules, components, events, and configuration files in Minecraft projects.

[![NPM](https://img.shields.io/npm/v/module-craft-code-cli?color=blue&label=Module%20Craft%20Code%20CLI)](https://www.npmjs.com/package/module-craft-code-cli)
[![GitHub tags](https://img.shields.io/github/tag/victorsigma/module-craft-code-cli?color=blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/tags)

[![Readme ES](https://img.shields.io/badge/readme-español-blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/blob/main/README_ES.md)
[![GitHub stars](https://img.shields.io/github/stars/victorsigma/module-craft-code-cli?color=blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/stargazers)



### Comandos

## Init

Initializes the project with a `addon.properties`.

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

Sets global configurations for the CLI.

```shell
mccc setting [opciones]

mccc s [opciones]
```

Opciones
> * `-l, --lang <string>`: Specifies the program language. Options: `"es"`, `"es"`.


## Generate

Generates custom components, elements, and blocks.

```shell
mccc generate [comando] [opciones]

mccc g [comando] [opciones]
```

Subcomandos
> * `component`: Generates a custom component.
> * `common`: Generates common files such as `lang`, `manifest`, `library`, `icon`.
> * `element`: Generates objects of type `entity`, `item`, `block`.


## Component

Generates a custom component.

```shell
mccc generate component [comando] [opciones]

mccc g c [comando] [opciones]
```

Subcomandos
> * `block`: Creates a custom component for a block.
> * `item`: Creates a custom component for an item.

Opciones
> * `-n, --name <string>`: Especifica el nombre del componente (por defecto: `"namespace:component"`).
> * `-d, --description <string>`: Especifica la descripción del componente (por defecto: `"description`").


### Block

Creates a custom component for a block.

```shell
mccc generate component block [opciones]

mccc g c block [opciones]
```

### Item

Creates a custom component for an item.

```shell
mccc generate component item [opciones]

mccc g c item [opciones]
```



## Common

Generates common files.

```shell
mccc generate common [comando] [opciones]

mccc g cm [comando] [opciones]
```

Subcomandos
> * `lang`: Generates a language file.
> * `manifest`: Generates a manifest.
> * `library`: Generates a library.
> * `icon`: Sets a generic icon for your project.



### Lang

Generates a language file.

```shell
mccc generate common lang [opciones]

mccc g cm lang [opciones]
```


Opciones
> * `-r, --region <string>`: Specifies the region for language localization.


### Manifest

Generates a `manifest.json`.

```shell
mccc generate common manifest [opciones]

mccc g cm manifest [opciones]
```

Opciones
> * `-l, --link <string>`: Links a resource_pack with a behavior_pack.
> * `-s, --scripts <boolean>`: Enables scripts in a behavior_pack.
> * `-c, --capabilities <boolean>`: Enables capabilities in a resource_pack.


### Library

Generates a library.

```shell
mccc generate common library [opciones]

mccc g cm library [opciones]
```

Opciones
> * `-m, --module <string>`: Especifica la librería que se va a agregar. Opciones: `bedrockSystem`, `blockManager`, `itemManager`.


### Icon

Sets a generic icon for your project.

```shell
mccc generate common icon [opciones]

mccc g cm icon [opciones]
```

Opciones
> * `-r, --random <boolean>`: Enables random icon selection (por defecto: `false`).


## Element

Generates objects of type `entity`, `item`, `block`.

```shell
mccc generate element [comando] [opciones]

mccc g e [comando] [opciones]
```

Subcomandos

> * `entity`: Generates an entity object.
> * `item`: Generates an item object.
> * `block`: Generates a block object.


### Entity

Generates an entity object.

```shell
mccc generate element entity [opciones]

mccc g e entity [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el identificador de la entidad (por defecto: `"namespace:entity"`).
> * `-r, --runtime <string>`: Sets the Vanilla Minecraft identifier this entity will use to build itself.
> * `-e, --experimental <boolean>`: Specifies if the entity will use experimental Minecraft features (por defecto: `false`).
> * `-sp, --spawnable <boolean>`: Specifies if the entity's spawn egg will appear in the creative inventory (por defecto: `false`).
> * `-su, --summonable <boolean>`: Specifies if the entity can be summoned using in-game commands (por defecto: `false`).


### Item

Generates an item object.

```shell
mccc generate element item [opciones]

mccc g e item [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el identificador del item (por defecto: `"namespace:item"`).
> * `-t, --type <string>`: Specifies the item type to create (por defecto: `"item"`). Opciones: `item`, `axe`, `pickaxe`, `shovel`, `sword`.
> * `-m, --menu <boolean>`: Indicates whether the item will have a custom section in the Minecraft menu (por defecto: `false`).


### Block

Generates a block object.

```shell
mccc generate element block [opciones]

mccc g e block [opciones]
```

Opciones
> * `-n, --name <string>`: Especifica el identificador del bloque (por defecto: `"namespace:block"`).
> * `-m, --menu <boolean>`: Indicates whether the block will have a custom section in the Minecraft menu (por defecto: `false`).
> * `-l, --liquid <boolean>`: Defines how the block behaves when detecting liquid (por defecto: `false`).
> * `-r, --render <string>`: Defines the block's texture material (por defecto: `"opaque"`). Opciones: `opaque`, `double_sided`, `blend`, `alpha_test`.