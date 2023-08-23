const {YMD, HMS} = require('./utils/Date')
const {checkDirs} = require('./utils/Path')
global.dispatcher = require('./utils/Dispatcher')

if (!process.env.camera_url) process.env.camera_url = "10.20.100.40"
if (!process.env.folder) process.env.folder = "images/10.20.100.40"
if (!process.env.server_url) process.env.server_url = "http://172.16.101.100"
if (!process.env.extra) {

    // fakeExtra.js

    // sended json
    const json = {
        "extra": [
            {
                "coords": [
                    {
                        "x1": 280,
                        "x2": 1480,
                        "y1": 0,
                        "y2": 900,
                        "zoneId": 1,
                        "zoneName": "zone zone1"
                    },
                    {
                        "x1": 909.7038724373576,
                        "x2": 1373.3029612756263,
                        "y1": 172.27249849246232,
                        "y2": 960.6624482412061,
                        "zoneId": 2,
                        "zoneName": "zone zone2"
                    }
                ]
            }
        ]
    }
    // stringify


    // parse
    const coords = json.extra[0].coords
    global.ZONES = {}
    for (const zone of coords) {
        const {x1, x2, y1, y2, zoneId, zoneName} = zone
        global.ZONES[zoneId] = {
            zoneId,
            zoneName,
            bbox: [x1, y1, x2 - x1, y2 - y1]
        }
    }
    console.log(global.ZONES)
}
process.env.N_CPUS = require('os').cpus().length
process.env.currentDebugFolder = `debug/operation-control/${YMD(new Date())}`
checkDirs([process.env.folder, process.env.currentDebugFolder])
process.env.launch = `${YMD(new Date())}_${HMS(new Date())}`
global.is_test = process.env.is_test ? true : false