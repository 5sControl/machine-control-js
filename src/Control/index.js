const EventAccumulator = require("./EventAccumulator")
const EventRegion = require('./EventRegion')
const axios = require('axios')

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

dispatcher.on("new snapshot received", async ({snapshot}) => {
    for (const zoneId in global.ZONES) {
        let detections = []
        try {
            const form = new FormData()
            form.append("zone", JSON.stringify(global.ZONES[zoneId].bbox))
            form.append("buffer", new Blob([snapshot.buffer]))
            const {data} = await axios.post(`${process.env.server_url}:9999/detect`, form)
            detections = data
            console.log(detections)
        } catch (error) {
            console.log(error)
        }
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