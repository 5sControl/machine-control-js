const loadYoloNAS = require('./models/yolo-nas')
const { cutRegionFromBlob } = require('../utils')

class Detector {
    model
    constructor() {
        if (!this.model) {
            console.time(`detector model load`)
            loadYoloNAS()
            .then(model => this.model = model)
            console.timeEnd(`detector model load`)
        }
    }
    async detect(buffer, bbox) {
        console.time("detect")
        const detections = await this.model.detect(buffer, bbox)
        console.timeEnd("detect")
        return detections
    }
}

const detector = new Detector()
dispatcher.on("new snapshot received", async ({snapshot}) => {
    for (const zoneId in global.ZONES) {
        const croppedBuffer = await cutRegionFromBlob(snapshot.buffer, global.ZONES[zoneId].bbox)
        const detections = await detector.detect(croppedBuffer, global.ZONES[zoneId].bbox) //server
        const persons = detections.filter(d => d.class === 'person')
        
        snapshot.detections = persons
        snapshot.zoneBbox = global.ZONES[zoneId].bbox
        if (persons[0]) {
            console.log(zoneId, "worker detected")
            dispatcher.emit("worker detected", {snapshot, zoneId, notForConsole: true })
        } else {
            console.log(zoneId, "worker not detected")
            dispatcher.emit("worker not detected", {snapshot, zoneId, notForConsole: true })
        }
    }
})