
import { ABundle, Chunk } from '../entry/entry.js';


const v1 = new Chunk();
v1.put('my-module', {});
v1.put('my-best-module', { name: 'old version' });
v1.replace('my-best-module', {})

const v2 = new Chunk();
v2.putAll({
    'my-module': {},
    'my-best-module': {},
    'useless-module': {}
});
v2.remove('useless-module');

const v3 = new Chunk({
    'my-module': {},
    'my-best-module': {}
});

const umd = {
    'default': {
        'my-module': {},
        'my-best-module': {}
    }
}

const v4 = Chunk.fromUmd(umd);

ABundle.put('v1', v1);
ABundle.put('v2', v2);
ABundle.put('v3', v3);
ABundle.put('v4', v4);


for (let chunkName in ABundle.chunks) {
    console.log(chunkName, ABundle.chunks[chunkName]);
}

console.log('ABundle', ABundle);
