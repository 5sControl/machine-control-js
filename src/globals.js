global.dispatcher = require('./utils/Dispatcher')

const {checkDirs} = require('./utils/Path')
checkDirs([process.env.folder])

if (!process.env.extra) process.env.extra = require('./utils/fakeExtra.js')