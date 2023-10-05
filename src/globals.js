global.dispatcher = require('./Dispatcher')

process.env.camera_ip = process.env.folder.split('/')[1]
if (!process.env.extra) process.env.extra = `[{"coords":[{"x1":80,"x2":1480,"y1":500,"y2":1080,"zoneId":1,"zoneName":"zone zone1"}]}]`
// if (!process.env.extra) process.env.extra = `[{"coords":[{"x1":280,"x2":880,"y1":200,"y2":900,"zoneId":1,"zoneName":"zone zone1"}]}]`
// if (!process.env.extra) process.env.extra = `[{"coords":[{"x1":280,"x2":580,"y1":200,"y2":600,"zoneId":1,"zoneName":"zone zone1"},{"x1":880,"x2":1914,"y1":583,"y2":1073,"zoneId":2,"zoneName":"zone zone2"}]}]`

// create zones
const coords = JSON.parse(process.env.extra)[0].coords
global.ZONES = {}
global.ZONES_bboxes = []

for (const zone of coords) {
    const {x1, x2, y1, y2, zoneId, zoneName} = zone
    global.ZONES[zoneId] = {
        zoneId,
        zoneName,
        bbox: [x1, y1, x2 - x1, y2 - y1]
    }
    global.ZONES_bboxes.push([x1, y1, x2 - x1, y2 - y1])
}
console.log("zones: ", global.ZONES)