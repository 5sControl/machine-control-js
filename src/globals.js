global.dispatcher = require('./utils/Dispatcher')

const {checkDirs} = require('./utils/Path')
checkDirs([process.env.folder])

process.env.camera_ip = process.env.folder.split('/')[1]
if (!process.env.extra) process.env.extra = require('./utils/fakeExtra.js')