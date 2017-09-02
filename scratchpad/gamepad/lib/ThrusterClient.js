class ThrusterClient {
    constructor(cb) {
        this.cb = cb;
        // this.socket = new WebSocket("ws://127.0.0.1:9997/");
        this.socket = new WebSocket("ws://192.168.0.1:9997/");
        this.socket.type = "arraybuffer";
        this.socket.addEventListener("message", (e) => this.message(e));

        if (this.cb !== null && this.cb !== undefined) {
            this.socket.addEventListener("open", cb);
        }
    }

    sendMessage(controller, type, index, value) {
        // console.log(`C: ${controller}, T: ${type}, I: ${index}, V: ${value}`);

        // build message binary payload per services/controllers/message.py
        let b1 =
            (controller & 0x03) << 6 |
            (type & 0x03) << 4 |
            (index & 0x0F);

        let floatArray = new Float32Array([value]);
        let byteArray = new Int8Array(floatArray.buffer);
        
        let result = new Int8Array([
            b1,
            byteArray[0],
            byteArray[1],
            byteArray[2],
            byteArray[3],
        ]);

        // send websocket packet
        this.socket.send(result);
    }

    message(e) {
        
    }
}
