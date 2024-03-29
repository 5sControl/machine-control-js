const EventAccumulator = require("./EventAccumulator")
const EventRegion = require('./EventRegion')
const {intersection} = require('./2D.js')

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

dispatcher.on("snapshot detected", async ({snapshot}) => {
    for (const zoneId in global.ZONES) {
        let isIntersect = false
        if (snapshot.detections) {
            for (const detection of snapshot.detections) {
                if (intersection(detection.bbox, global.ZONES[zoneId].bbox)) {
                    isIntersect = true
                    detection.isIntersect = true
                    break
                }
            }
        }
        if (isIntersect) {
            console.log(zoneId, "worker detected")
            dispatcher.emit("worker detected", {snapshot, zoneId, notForConsole: true })
        } else {
            console.log(zoneId, "worker not detected")
            dispatcher.emit("worker not detected", {snapshot, zoneId, notForConsole: true })
        }
    }
})