global.dispatcher = require('./Dispatcher')

process.env.camera_ip = process.env.folder.split('/')[1]
if (!process.env.extra) process.env.extra = `[{"coords":[{"x1":280,"x2":480,"y1":200,"y2":500,"zoneId":1,"zoneName":"zone zone1"},{"x1":1564,"x2":1914,"y1":783,"y2":1073,"zoneId":2,"zoneName":"zone zone2"}]}]`