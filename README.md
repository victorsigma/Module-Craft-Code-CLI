# Module Craft Code CLI

### CLI versátil para generar y gestionar módulos, componentes, eventos y archivos de configuración en proyectos de Minecraft.

### Comandos

## Init

Inicializa el proyecto con un archivo `addon.properties`.

> **mccc init [opciones]**
>
> **mccc i [opciones]**

Opciones
> * `-n, --name <string>`: Especifica el nombre del addon (por defecto: `"New Addon"`).
> * `-s, --namespace <string>`: Especifica el namespace del addon (por defecto: `"namespace"`).
> * `-d, --description <string>`: Especifica la descripción del addon (por defecto: `"Addon Description"`).
> * `-t, --type <string>`: Especifica el tipo de proyecto (por defecto: `"behavior"`). Opciones: `behavior`, `resource`, `skin`.

<full-line></full-line>

## Generate

Genera componentes personalizados, elementos y bloques.

> **mccc generate [comando] [opciones]**
>
> **mccc g [comando] [opciones]**

Subcomandos
> * `component`: Genera un componente personalizado.
> * `common`: Genera archivos comunes como `lang`, `manifest`, `library`, `icon`.
> * `element`: Genera objetos de tipo `entity`, `item`, `block`.

<full-line></full-line>

## Component

Genera un componente personalizado.

> **mccc generate component [comando] [opciones]**
>
> **mccc g c [comando] [opciones]**

Subcomandos
> * `block`: Crea un componente personalizado para un bloque.
> * `item`: Crea un componente personalizado para un item.

Opciones
> * `-n, --name <string>`: Especifica el nombre del componente (por defecto: `"namespace:component"`).
> * `-d, --description <string>`: Especifica la descripción del componente (por defecto: `"description`").

<mid-line></mid-line>

### Block

Crea un componente personalizado para un bloque.

> **mccc generate component block [opciones]**
>
> **mccc g c block [opciones]**

<mid-line></mid-line>

### Item

Crea un componente personalizado para un item.

> **mccc generate component item [opciones]**
>
> **mccc g c item [opciones]**


<full-line></full-line>

## Common

Genera archivos comunes.

> **mccc generate common [comando] [opciones]**
>
> **mccc g cm [comando] [opciones]**

Subcomandos
> * `lang`: Genera un archivo de idioma.
> * `manifest`: Genera un archivo manifest.
> * `library`: Genera una librería.
> * `icon`: Establece un icono genérico para tu proyecto.

<mid-line></mid-line>

### Lang

Genera un archivo de idioma.

> **mccc generate common lang [opciones]**
>
> **mccc g cm lang [opciones]**



Opciones
> * `-r, --region <string>`: Especifica la región para la localización de idioma.

<mid-line></mid-line>

### Manifest

Genera un archivo `manifest.json`.

> **mccc generate common manifest [opciones]**
>
> **mccc g cm manifest [opciones]**

Opciones
> * `-l, --link <string>`: Vincula un resource_pack con un behavior_pack.
> * `-s, --scripts <boolean>`: Habilita los scripts en un behavior_pack.
> * `-c, --capabilities <boolean>`: Habilita las capacidades en un resource_pack.

<mid-line></mid-line>

### Library

Genera una librería.

> **mccc generate common library [opciones]**
>
> **mccc g cm library [opciones]**

Opciones
> * `-m, --module <string>`: Especifica la librería que se va a agregar. Opciones: `bedrockSystem`, `blockManager`, `itemManager`.

<mid-line></mid-line>

### Icon

Establece un icono genérico para tu proyecto.

> **mccc generate common icon [opciones]**
>
> **mccc g cm icon [opciones]**

Opciones
> * `-r, --random <boolean>`: Habilita la selección aleatoria de íconos (por defecto: `false`).

<full-line></full-line>

## Element

Genera objetos de tipo `entity`, `item`, `block`.

> **mccc generate element [comando] [opciones]**
>
> **mccc g e [comando] [opciones]**

Subcomandos

> * `entity`: Genera un objeto de entidad.
> * `item`: Genera un objeto item.
> * `block`: Genera un objeto de bloque.

<mid-line></mid-line>

### Entity

Genera un objeto de entidad.

> **mccc generate element entity [opciones]**
>
> **mccc g e entity [opciones]**

Opciones
> * `-n, --name <string>`: Especifica el identificador de la entidad (por defecto: `"namespace:entity"`).
> * `-r, --runtime <string>`: Establece el identificador de Vanilla Minecraft que esta entidad utilizará para construirse a sí misma.
> * `-e, --experimental <boolean>`: Especifica si la entidad estará bajo características experimentales de Minecraft (por defecto: `false`).
> * `-sp, --spawnable <boolean>`: Especifica si el generador de la entidad aparecerá en el inventario de creativo (por defecto: `false`).
> * `-su, --summonable <boolean>`: Especifica si la entidad puede ser invocada mediante comandos en el juego (por defecto: `false`).

<mid-line></mid-line>

### Item

Genera un objeto item.

> **mccc generate element item [opciones]**
>
> **mccc g e item [opciones]**

Opciones
> * `-n, --name <string>`: Especifica el identificador del item (por defecto: `"namespace:item"`).
> * `-t, --type <string>`: Especifica el tipo de item a crear (por defecto: `"item"`). Opciones: `item`, `axe`, `pickaxe`, `shovel`, `sword`.
> * `-m, --menu <boolean>`: Indica si el item tendrá una sección personalizada en el menú de Minecraft (por defecto: `false`).

<mid-line></mid-line>

### Block

Genera un objeto de bloque.

> **mccc generate element block [opciones]**
>
> **mccc g e block [opciones]**

Opciones
> * `-n, --name <string>`: Especifica el identificador del bloque (por defecto: `"namespace:block"`).
> * `-m, --menu <boolean>`: Indica si el bloque tendrá una sección personalizada en el menú de Minecraft (por defecto: `false`).
> * `-l, --liquid <boolean>`: Define cómo se comporta un bloque al detectar un líquido (por defecto: `false`).
> * `-r, --render <string>`: Define el material de la textura del bloque (por defecto: `"opaque"`). Opciones: `opaque`, `double_sided`, `blend`, `alpha_test`.

<full-line></full-line>
