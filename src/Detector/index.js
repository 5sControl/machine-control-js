const loadYoloNAS = require('./models/yolo-nas')
const {bboxAtWorkspace} = require('../utils/2D')

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
    async detect(buffer) {
        console.time("detect")
        const detections = await this.model.detect(buffer)
        console.timeEnd("detect")
        return detections
    }
}

const detector = new Detector()
dispatcher.on("new snapshot received", async ({snapshot}) => {
    const detections = await detector.detect(snapshot.buffer)
    const persons = detections.filter(d => d.class === 'person')
    snapshot.detections = persons
    for (const zoneId in global.ZONES) {
        snapshot.zoneBbox = global.ZONES[zoneId].bbox
        if (persons.length > 0) {
            for (const person of persons) {
                if (bboxAtWorkspace(person.bbox, global.ZONES[zoneId].bbox)) {
                    dispatcher.emit("worker detected", {snapshot, zoneId, notForConsole: true })
                } else {
                    dispatcher.emit("worker not detected", {snapshot, zoneId, notForConsole: true })
                }
            }
        } else {
            dispatcher.emit("worker not detected", {snapshot, zoneId, notForConsole: true })
        }
    }
})