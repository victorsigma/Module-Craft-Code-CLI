# Module Craft Code CLI

### CLI versátil para generar y gestionar módulos, componentes, eventos y archivos de configuración en proyectos de Minecraft.

### Comandos

<full-line></full-line>

## Init

Inicializa el proyecto con un archivo `addon.properties`.

> **<text-red>mccc </text-red> <text-green>init</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>i</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Opciones
> * `-n, --name <string>`: Especifica el nombre del addon (por defecto: `"New Addon"`).
> * `-s, --namespace <string>`: Especifica el namespace del addon (por defecto: `"namespace"`).
> * `-d, --description <string>`: Especifica la descripción del addon (por defecto: `"Addon Description"`).
> * `-t, --type <string>`: Especifica el tipo de proyecto (por defecto: `"behavior"`). Opciones: `behavior`, `resource`, `skin`.

<full-line></full-line>

## Generate

Genera componentes personalizados, elementos y bloques.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-yellow>[</text-yellow><span>comando</span><text-yellow>]</text-yellow> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-yellow>[</text-yellow><span>comando</span><text-yellow>]</text-yellow> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Subcomandos
> * `component`: Genera un componente personalizado.
> * `common`: Genera archivos comunes como `lang`, `manifest`, `library`, `icon`.
> * `element`: Genera objetos de tipo `entity`, `item`, `block`.

<full-line></full-line>

## Component

Genera un componente personalizado.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>component</text-green> <text-yellow>[</text-yellow><span>comando</span><text-yellow>]</text-yellow> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>c</text-green> <text-yellow>[</text-yellow><span>comando</span><text-yellow>]</text-yellow> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Subcomandos
> * `block`: Crea un componente personalizado para un bloque.
> * `item`: Crea un componente personalizado para un item.

Opciones
> * `-n, --name <string>`: Especifica el nombre del componente (por defecto: `"namespace:component"`).
> * `-d, --description <string>`: Especifica la descripción del componente (por defecto: `"description`").

<mid-line></mid-line>

### Block

Crea un componente personalizado para un bloque.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>component</text-green> <text-green>block</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>c</text-green> <text-green>block</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

<mid-line></mid-line>

### Item

Crea un componente personalizado para un item.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>component</text-green> <text-green>item</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>c</text-green> <text-green>item</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**


<full-line></full-line>

## Common

Genera archivos comunes.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>common</text-green> <text-yellow>[</text-yellow><span>comando</span><text-yellow>]</text-yellow> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>cm</text-green> <text-yellow>[</text-yellow><span>comando</span><text-yellow>]</text-yellow> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Subcomandos
> * `lang`: Genera un archivo de idioma.
> * `manifest`: Genera un archivo manifest.
> * `library`: Genera una librería.
> * `icon`: Establece un icono genérico para tu proyecto.

<mid-line></mid-line>

### Lang

Genera un archivo de idioma.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>common</text-green> <text-green>lang</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>cm</text-green> <text-green>lang</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**



Opciones
> * `-r, --region <string>`: Especifica la región para la localización de idioma.

<mid-line></mid-line>

### Manifest

Genera un archivo `manifest.json`.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>common</text-green> <text-green>manifest</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>cm</text-green> <text-green>manifest</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Opciones
> * `-l, --link <string>`: Vincula un resource_pack con un behavior_pack.
> * `-s, --scripts <boolean>`: Habilita los scripts en un behavior_pack.
> * `-c, --capabilities <boolean>`: Habilita las capacidades en un resource_pack.

<mid-line></mid-line>

### Library

Genera una librería.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>common</text-green> <text-green>library</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>cm</text-green> <text-green>library</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Opciones
> * `-m, --module <string>`: Especifica la librería que se va a agregar. Opciones: `bedrockSystem`, `blockManager`, `itemManager`.

<mid-line></mid-line>

### Icon

Establece un icono genérico para tu proyecto.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>common</text-green> <text-green>icon</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>cm</text-green> <text-green>icon</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Opciones
> * `-r, --random <boolean>`: Habilita la selección aleatoria de íconos (por defecto: `false`).

<full-line></full-line>

## Element

Genera objetos de tipo `entity`, `item`, `block`.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>element</text-green> <text-yellow>[</text-yellow><span>comando</span><text-yellow>]</text-yellow> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>e</text-green> <text-yellow>[</text-yellow><span>comando</span><text-yellow>]</text-yellow> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Subcomandos

> * `entity`: Genera un objeto de entidad.
> * `item`: Genera un objeto item.
> * `block`: Genera un objeto de bloque.

<mid-line></mid-line>

### Entity

Genera un objeto de entidad.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>element</text-green> <text-green>entity</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>e</text-green> <text-green>entity</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Opciones
> * `-n, --name <string>`: Especifica el identificador de la entidad (por defecto: `"namespace:entity"`).
> * `-r, --runtime <string>`: Establece el identificador de Vanilla Minecraft que esta entidad utilizará para construirse a sí misma.
> * `-e, --experimental <boolean>`: Especifica si la entidad estará bajo características experimentales de Minecraft (por defecto: `false`).
> * `-sp, --spawnable <boolean>`: Especifica si el generador de la entidad aparecerá en el inventario de creativo (por defecto: `false`).
> * `-su, --summonable <boolean>`: Especifica si la entidad puede ser invocada mediante comandos en el juego (por defecto: `false`).

<mid-line></mid-line>

### Item

Genera un objeto item.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>element</text-green> <text-green>item</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>e</text-green> <text-green>item</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Opciones
> * `-n, --name <string>`: Especifica el identificador del item (por defecto: `"namespace:item"`).
> * `-t, --type <string>`: Especifica el tipo de item a crear (por defecto: `"item"`). Opciones: `item`, `axe`, `pickaxe`, `shovel`, `sword`.
> * `-m, --menu <boolean>`: Indica si el item tendrá una sección personalizada en el menú de Minecraft (por defecto: `false`).

<mid-line></mid-line>

### Block

Genera un objeto de bloque.

> **<text-red>mccc </text-red> <text-green>generate</text-green> <text-green>element</text-green> <text-green>block</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**
>
> **<text-red>mccc </text-red> <text-green>g</text-green> <text-green>e</text-green> <text-green>block</text-green> <text-yellow>[</text-yellow><span>opciones</span><text-yellow>]</text-yellow>**

Opciones
> * `-n, --name <string>`: Especifica el identificador del bloque (por defecto: `"namespace:block"`).
> * `-m, --menu <boolean>`: Indica si el bloque tendrá una sección personalizada en el menú de Minecraft (por defecto: `false`).
> * `-l, --liquid <boolean>`: Define cómo se comporta un bloque al detectar un líquido (por defecto: `false`).
> * `-r, --render <string>`: Define el material de la textura del bloque (por defecto: `"opaque"`). Opciones: `opaque`, `double_sided`, `blend`, `alpha_test`.

<full-line></full-line>


<style>
    full-line::after {
        content: '';
        position: absolute;
        top: 50%;
        height: 2px;
        background-color: #7fb35c;
        width: 100%;
        transform: translateY(-50%);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    mid-line::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 2.5%;
        height: 2px;
        background-color: #a1295b;
        width: 95%;
        transform: translateY(-50%);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }


    body {
        padding: 20px;
    }

    h1, h2, h3, p {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    full-line:hover::after {
        background-color: #5d9441;
    }

    mid-line:hover::after {
        background-color: #7b1d49;
    }

    text-red {
        color: #a1295b;
    }

    text-green {
        color: #7fb35c;
    }

    text-yellow {
        color: #d6c165;
    }
</style>