
export class Bundle {

    constructor () {
        this.chunks = {};
    }

    get (name) {

        const chunk = this.chunks[name];

        if (!chunk) {
            throw new Error(`Chunk with name "${ name }" not initialized`)
        }

        return this.chunks[name];
    }

    put (name, chunk) {

        if (this.chunks[name]) {
            throw new Error(`Chunk with name "${ name }" already initialized in the bundle`);
        }

        this.chunks[name] = chunk;

        return chunk;
    }

    remove (name) {
        const removedChunk = this.chunks[name];
        delete this.chunks[name];
        return removedChunk;
    }
}
