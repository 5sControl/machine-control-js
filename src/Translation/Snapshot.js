class Snapshot {
    constructor(buffer, index) {
        this.buffer = buffer
        this.index = index.toString()
        this.received = new Date()
        this.detections = []
    }
}

module.exports = Snapshot