const EventAccumulator = require("./EventAccumulator")
const EventRegion = require('./EventRegion')

let controls = {}
for (const zoneId in global.ZONES) {
    const worker_out_workplace = new EventAccumulator("worker out workplace", "worker not detected", "worker detected", zoneId)
    const worker_at_workplace = new EventAccumulator("worker at workplace", "worker detected", "worker not detected", zoneId)
    const machine_control = new EventRegion(worker_out_workplace, worker_at_workplace, zoneId)
    controls[zoneId] = {
        worker_out_workplace,
        worker_at_workplace,
        machine_control
    }
}

const { cutRegionFromBlob } = require('../utils')
const detector = require('../../../js-inference-server/src/Detector')
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