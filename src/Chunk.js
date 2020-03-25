

export class Chunk {

    // It's possible to pass window object (or global object in node.js) as modules container
    constructor (modulesContainer) {
        this.modules = modulesContainer || {};
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
}
