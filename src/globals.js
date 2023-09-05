const {checkDirs} = require('./utils/Path')
const fakeExtra = require('./utils/fakeExtra.js')
global.dispatcher = require('./utils/Dispatcher')

if (!process.env.camera_url) process.env.camera_url = "10.20.100.40"
if (!process.env.folder) process.env.folder = "images/10.20.100.40"
if (!process.env.server_url) process.env.server_url = "http://172.16.101.100"
console.log("incoming process.env.extra: ", process.env.extra)
if (!process.env.extra) process.env.extra = fakeExtra

// create zones
const coords = JSON.parse(process.env.extra)[0].coords
global.ZONES = {}
for (const zone of coords) {
    const {x1, x2, y1, y2, zoneId, zoneName} = zone
    global.ZONES[zoneId] = {
        zoneId,
        zoneName,
        bbox: [x1, y1, x2 - x1, y2 - y1]
    }
}
console.log("zones: ", global.ZONES)

checkDirs([process.env.folder])