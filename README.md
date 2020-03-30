
### Reasons

1. Make most common way to developing anything on JavaScript in modular way
2. Use power of webpack with default configuration

### Solution

ABundle - a middleware object for sharing resources to make possible

  - import modules in different ways for make development faster
  - better connect and assembling modules

### Structure of module

```

/src

    // export of CHUNK_NAME from chunk-name.js
    // CHUNK_NAME should be same as "name" (in package.json)
    chunk-name.js

    // only imports of 'a-bundle' and 'chunk-name' is allowed
    // exports of modules from chunk = ABundle.get(CHUNK_NAME)
    // all code must import externals modules only from here
    chunk-e.js

    // export of module functionality
    index.js

    // imports of external modules e.g. `import React from 'react'; ... `
    // packing into modules object `{ react: React }`
    // export default MODULES
    modules.js

/entry // allows uniquely assemble module into another module webpack

    // `import modules from 'modules.js'`
    // initialization and ABundle.put(CHUNK_NAME, chunk)
    // export default chunk
    chunk-i.js

    // "source": "entry/entry.js" (in package.json)
    // import 'chunk-i.js'
    // export * from 'index.js'
    entry.js

/dev // fast development without recompiling external modules

    /src
        // initialization of ABundle.get(CHUNK_NAME) from global variables (e.g. `window.modules`)
        chunk-i.js

        // import 'chunk-i.js'
        // import { .. } from 'index.js'
        // some functionality to test and develop library
        dev.js

        // dev builder to /app/build/_dev.js
        webpack.config.js


    /global // build all external code into global variable for development purposes

        // contains prebuilt globally assigned modules
        // `import modules from 'modules.js'`
        // `window.modules = modules`
        global.js

        // bundle builder to /app/build/_global.js
        webpack.config.js

    /app

        /build //folder with built resources

        // `<script src="build/_global.js"/>`
        // `<script src="build/_dev.js"/>`
        index.html
        index.css


```


### Connecting different versions of same module

#### Example:

  - 'my-module' is using react v17
  - 'external-module' is using react v15 (and incompatible with react v17)

#### Solution 1:

  - go to `my-module/node_modules/external-module`
  - `run npm i react@15`
  - so react v15 must be installed into `my-module/node_modules/external-module/node_modules`
  - now, during `external-module` compilation __webpack__ should take react from closest to the module `node_modules` folder

#### Solution 2 (not recommended):

```
// react-module-legacy-entry.js

import React from '../react-v13/'
import { Chunk } from '../react-module/entry/chunk-i.js'

Chunk.replace('react', React);

export * from '../module-1/index.js'

```