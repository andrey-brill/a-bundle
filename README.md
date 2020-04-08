
# ABundle

__Assemble smarter. Develop faster.__

### Reasons

- Make most common way to developing anything on JavaScript in modular way
- Make connecting between modules clear and transparent
- Use power of webpack with the simplest configuration
- Less custom features as possible to prevent painful support

### Solution

ABundle - a middleware object for sharing resources to make possible

- import modules in different ways for make development faster
- better connect and assembling modules

### Common structure of module

```

package.json

    "name": "my-module",
    "source": "entry/entry.js"
    ...


// contains raw sources of module
// the sources should be compiled before use
/@src


    chunk-name.js

        // should be the same as module name (in package.json)
        const CHUNK_NAME = 'my-module';

        export { CHUNK_NAME };


    // all code must import externals modules only from here
    chunk-e.js

        // only imports of 'a-bundle' and 'chunk-name' is allowed
        import { CHUNK_NAME } from './chunk-name.js';
        import { ABundle } from 'a-bundle';

        const chunk = ABundle.get(CHUNK_NAME);

        // highly recommend to convert kebab-case to pascal-case as is
        const OtherModule = chunk.get('other-module');
        const AnAnotherModule = chunk.get('an-another-module');

        // exports of external modules
        export { OtherModule, AnAnotherModule };


    // export of module functionality
    index.js

        // do not use default
        export * from './core/Core.js';
        ...
        export * from './helpers/StaticCore.js';


    // imports of external modules
    modules.js

        import OtherModule from 'other-module';
        import * as AnAnotherModule from 'an-another-module';

        const MODULES = {
            'other-module': OtherModule,
            'an-another-module': AnAnotherModule
        }

        export { MODULES };


// allows assemble module into another modules via webpack
/entry

    // initialization of AChunk
    chunk-i.js

        import { ABundle, Chunk } from 'a-bundle';
        import { CHUNK_NAME } from '../src/chunk-name.js';
        import { MODULES } from '../src/modules.js';

        const AChunk = new Chunk();
        AChunk.putAll(MODULES);

        ABundle.put(CHUNK_NAME, AChunk);

        export { AChunk };


    // exporting module in webpack module way
    entry.js

        import './chunk-i.js';
        export * from '../src/index.js';


```

### EDD (example-driven development) with ABundle

- fast development based on EDD
- external modules will be compiled __once__ into a global bundle

```

/examples


    /src
        // initialization of ABundle.get(CHUNK_NAME) from global variables (e.g. `window.modules`)
        chunk-i.js

        // import 'chunk-i.js'
        // import { .. } from 'index.js'
        // some functionality to test and develop library
        examples.js
        examples.scss

        // in development to /spa/build/examples.js
        // in production to /docs/dist/examples.[hash].js
        webpack.config.js


    // build all external modules into UMD library for development purposes
    /modules

        // contains prebuilt globally assigned modules
        // `import { MODULES } from 'modules.js'`
        // export default MODULES;
        modules.js

        // bundle builder in development to /spa/build/modules.js
        // bundle builder in production to /docs/dist/modules.[hash].js
        webpack.config.js


    // content of SPA
    /spa

        // folders with built resources and assets
        /build
        /assets
        favicon.ico


// production build of examples for Github pages
/docs

```


### Connecting different versions of same module

#### Example:

- 'my-module' is using react v17
- 'external-module' is using react v15 (and incompatible with react v17)

#### Solution 1 (NOT TESTED):

- go to `my-module/node_modules/external-module`
- `run npm i react@15`
- so react v15 must be installed into `my-module/node_modules/external-module/node_modules`
- now, during `external-module` compilation __webpack__ should take react from closest to the module `node_modules` folder

#### Solution 2:

```
// react-module-legacy-entry.js

import React from '../react-v13/'
import { Chunk } from '../react-module/entry/chunk-i.js'

Chunk.replace('react', React);

export * from '../module-1/index.js'

```