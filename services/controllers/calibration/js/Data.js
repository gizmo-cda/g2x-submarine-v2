let HL = 0;
let VL = 1;
let VC = 2;
let VR = 3;
let HR = 4;

class Data {
    static getData(cb) {
        xhr.get('/api/settings', cb);
    }

    static getNamedData(name, cb) {
        if (name === "" || name === null || name === undefined) {
            this.getData(cb);
        }
        else {
            xhr.get('/api/settings/' + name, cb);
        }
    }

    static sendData(data, cb) {
        xhr.put('/api/settings', data, cb);
    }
}
