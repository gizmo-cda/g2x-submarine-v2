class ThrusterClient {
    constructor() {
        // TODO: initialize our websocket connection
    }

    sendMessage(controller, type, index, value) {
        // build message binary payload per services/controllers/message.py
        let fa = new Float32Array([value]);
        let ba = new Int8Array(fa.buffer);
        console.log(ba);

        // send websocket packet
    }
}
