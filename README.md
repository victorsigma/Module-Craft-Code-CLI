![MCCC Banner](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/banner-mccc.gif)

# Module Craft Code CLI (MCCC)
> ⚡ A fast CLI for Minecraft Bedrock Add-On development

## 🚀 What is MCCC?

**MCCC** is a CLI tool that helps you **build Minecraft Bedrock Add-Ons faster** by generating structured files, components, and elements automatically.

⚡ Reduce repetitive setup  
⚡ Generate entities, blocks, and items instantly  
⚡ Maintain a clean and scalable project structure  

> Designed for Minecraft creators who want to move faster and focus on gameplay.

[![NPM](https://img.shields.io/npm/v/module-craft-code-cli?color=blue&label=Module%20Craft%20Code%20CLI)](https://www.npmjs.com/package/module-craft-code-cli)
![Node.js](https://img.shields.io/badge/node-%3E%3D22.12.0-339933?logo=node.js&logoColor=white)

[![GitHub tags](https://img.shields.io/github/tag/victorsigma/module-craft-code-cli?color=blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/tags)
[![GitHub stars](https://img.shields.io/github/stars/victorsigma/module-craft-code-cli?color=blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/stargazers)

[![Readme ES](https://img.shields.io/badge/readme-español-blue)](https://github.com/victorsigma/Module-Craft-Code-CLI/blob/main/README_ES.md)



## 📦 Installation

```bash
npm install -g module-craft-code-cli
```
![Install CLI demo](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/install.gif)

## ⚡ Quick Start

> Note: The namespace is automatically inferred from the project configuration.  
> If multiple namespaces exist, you will be prompted to choose one.

**1. Initialize a new Add-On project (Behavior Pack)**
```bash
mccc init -n "Magic Creatures" -s "magicre"
```
![Initialize project demo](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/init.gif)

**2. Generate a custom block**
```bash
mccc generate element block -n "mystical_slab" -p "slab" -m true
```
![Generate block demo](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/block.gif)

**3. Generate a custom entity**
```bash
mccc generate element entity -n "unicorn" -e false -sp true -su true
```
![Generate entity demo](https://raw.githubusercontent.com/victorsigma/Module-Craft-Code-CLI/main/docs/assets/entity.gif)

## 🧱 Example Output

> Note: Files are grouped by namespace (e.g. `magicre`) to prevent conflicts  
> and support multi-namespace projects.

After running the commands above, your project structure will look like:

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

## 📋 Commands

| Command | Alias | Description |
|---|---|---|
| `mccc init` | `mccc i` | Initialize a new Add-On project |
| `mccc setting` | `mccc s` | Set global CLI configurations |
| `mccc generate component block` | `mccc g c block` | Generate a custom block component |
| `mccc generate component item` | `mccc g c item` | Generate a custom item component |
| `mccc generate common lang` | `mccc g cm lang` | Generate a language file |
| `mccc generate common manifest` | `mccc g cm manifest` | Generate a manifest.json |
| `mccc generate common library` | `mccc g cm library` | Generate a library |
| `mccc generate common icon` | `mccc g cm icon` | Set a project icon |
| `mccc generate common model` | `mccc g cm model` | Generate a model file |
| `mccc generate element entity` | `mccc g e entity` | Generate an entity object |
| `mccc generate element item` | `mccc g e item` | Generate an item object |
| `mccc generate element block` | `mccc g e block` | Generate a block object |


## Init

Initializes the project with a `addon.properties`.

```shell
mccc init [options]

mccc i [options]
```

Options
> * `-n, --name <string>`: Specifies the name of the Add-On (default: `"New Addon"`).
> * `-s, --namespace <string>`: Specifies the namespace of the Add-On (default: `"namespace"`).
> * `-d, --description <string>`: Specifies the description of the Add-On (default: `"Addon Description"`).
> * `-t, --type <string>`: Specifies the type of project (default: `"behavior"`). Options: `behavior`, `resource`, `skin`.

## Setting

Sets global configurations for the CLI.

```shell
mccc setting [options]

mccc s [options]
```

Options
> * `-l, --lang <string>`: Specifies the program language. Options: `"es"`, `"en"`.


## Generate

Generates custom components, elements, and common project files.

```shell
mccc generate [command] [options]

mccc g [command] [options]
```

Subcommands
> * `component`: Generates a custom component.
> * `common`: Generates common files such as `lang`, `manifest`, `library`, `icon`, `model`.
> * `element`: Generates objects of type `entity`, `item`, `block`.


## Component

Generates a custom component.

```shell
mccc generate component [command] [options]

mccc g c [command] [options]
```

Subcommands
> * `block`: Creates a custom component for a block.
> * `item`: Creates a custom component for an item.

Options
> * `-n, --name <string>`: Specifies the name of the component (default: `"namespace:component"`).
> * `-d, --description <string>`: Specifies the description of the component (default: `"description"`).
> * `-p, --prefab <string>`: Specifies the prefab the component will use (default: `"none"`). Options: `none`, `slab`.

### Block

Creates a custom component for a block.

```shell
mccc generate component block [options]

mccc g c block [options]
```

### Item

Creates a custom component for an item.

```shell
mccc generate component item [options]

mccc g c item [options]
```



## Common

Generates common files.

```shell
mccc generate common [command] [options]

mccc g cm [command] [options]
```

Subcommands
> * `lang`: Generates a language file.
> * `manifest`: Generates a manifest.
> * `library`: Generates a library.
> * `icon`: Sets a generic icon for your project.
> * `model`: Generates a model file.



### Lang

Generates a language file.

```shell
mccc generate common lang [options]

mccc g cm lang [options]
```


Options
> * `-r, --region <string>`: Specifies the region for language localization.


### Manifest

Generates a `manifest.json`.

```shell
mccc generate common manifest [options]

mccc g cm manifest [options]
```

Options
> * `-l, --link <string>`: Links a resource_pack with a behavior_pack.
> * `-s, --scripts <boolean>`: Enables scripts in a behavior_pack.
> * `-c, --capabilities <boolean>`: Enables capabilities in a resource_pack.


### Library

Generates a library.

```shell
mccc generate common library [options]

mccc g cm library [options]
```

Options
> * `-m, --module <string>`: Specifies the library to add. Options: `bedrockSystem`, `blockManager`, `itemManager`.


### Icon

Sets a generic icon for your project.

```shell
mccc generate common icon [options]

mccc g cm icon [options]
```

Options
> * `-r, --random <boolean>`: Enables random icon selection (default: `false`).


### Model

Generates a model file.

```shell
mccc generate common model [options]

mccc g cm mo [options]
```

Options
> * `-t, --type <string>`: Specifies the type of model to create - Resource pack only (default: `"slab"`). Options: `slab`, `stair`, `fence`.


## Element

Generates objects of type `entity`, `item`, `block`.

```shell
mccc generate element [command] [options]

mccc g e [command] [options]
```

Subcommands

> * `entity`: Generates an entity object.
> * `item`: Generates an item object.
> * `block`: Generates a block object.


### Entity

Generates an entity object.

```shell
mccc generate element entity [options]

mccc g e entity [options]
```

Options
> * `-n, --name <string>`: Specifies the entity identifier (default: `"namespace:entity"`).
> * `-r, --runtime <string>`: Sets the Vanilla Minecraft identifier this entity will use to build itself.
> * `-e, --experimental <boolean>`: Specifies if the entity will use experimental Minecraft features (default: `false`).
> * `-sp, --spawnable <boolean>`: Specifies if the entity's spawn egg will appear in the creative inventory (default: `false`).
> * `-su, --summonable <boolean>`: Specifies if the entity can be summoned using in-game commands (default: `false`).


### Item

Generates an item object.

```shell
mccc generate element item [options]

mccc g e item [options]
```

Options
> * `-n, --name <string>`: Specifies the item identifier (default: `"namespace:item"`).
> * `-t, --type <string>`: Specifies the item type to create (default: `"item"`). Options: `item`, `axe`, `pickaxe`, `shovel`, `slab`, `sword`.
> * `-m, --menu <boolean>`: Indicates whether the item will have a custom section in the Minecraft menu (default: `false`).


### Block

Generates a block object.

```shell
mccc generate element block [options]

mccc g e block [options]
```

Options
> * `-n, --name <string>`: Specifies the block identifier (default: `"namespace:block"`).
> * `-p, --prefab <string>`: Specifies the prefab the block will use (default: `"block"`). Options: `block`, `slab`, `stair`, `fence`.
> * `-m, --menu <boolean>`: Indicates whether the block will have a custom section in the Minecraft menu (default: `false`).
> * `-l, --liquid <boolean>`: Defines how the block behaves when detecting liquid (default: `false`).
> * `-r, --render <string>`: Defines the block's texture material (default: `"opaque"`). Options: `opaque`, `double_sided`, `blend`, `alpha_test`.