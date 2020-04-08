

export class Chunk {

    modules = {}

    constructor (modules = {}) {
        this.putAll(modules);
    }

    get (name) {

        const module = this.modules[name];

        if (!module) {
            throw new Error(`Module with name "${ name }" not initialized`)
        }

        return module;
    }

    put (name, module) {

        if (this.modules[name]) {
            throw new Error(`Module with name "${ name }" already initialized`);
        }

        this.modules[name] = module;

        return module;
    }

    putAll (object) {
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                this.put(key, object[key]);
            }
        }
    }

    remove (name) {
        const removedModule = this.modules[name];
        delete this.modules[name];
        return removedModule;
    }

    replace (name, module) {
        this.remove(name);
        return this.put(name, module);
    }

    static fromUmd (umd) {

        if (!umd || !umd.default) {
            throw new Error(`UMD is undefined or doesn't export modules as 'default' property.`)
        }

        return new Chunk(umd.default);
    }
}
