// @flow

export default class ArrayService {
    static unique(array: Array<*>): Array<*> {
        const n = {};
        const r = [];
        for (let i = 0; i < array.length; i++) {
            if (!n[array[i]]) {
                n[array[i]] = true;
                r.push(array[i]);
            }
        }
        return r;
    }

    static uniqueEntity(array: Array<Entity>): Array<Entity> {
        const n = {};
        const r = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i]) {
                const id = array[i].id;
                if (!n[id]) {
                    n[id] = true;
                    r.push(array[i]);
                }
            }
        }
        return r;
    }
}
