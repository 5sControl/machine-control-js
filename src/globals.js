const {checkDirs} = require('./utils/Path')
const fakeExtra = require('./utils/fakeExtra.js')
global.dispatcher = require('./utils/Dispatcher')

if (!process.env.server_url) process.env.server_url = "http://172.16.101.100"
if (!process.env.folder) process.env.folder = "images/10.20.100.40"
checkDirs([process.env.folder])
console.log("incoming process.env.extra: ", process.env.extra)
if (!process.env.extra) process.env.extra = fakeExtra