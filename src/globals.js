const {YMD, HMS} = require('./utils/Date')
const {checkDirs} = require('./utils/Path')
global.dispatcher = require('./utils/Dispatcher')

if (!process.env.camera_url) process.env.camera_url = "10.20.100.40"
if (!process.env.folder) process.env.folder = "images/10.20.100.40"
if (!process.env.server_url) process.env.server_url = "http://172.16.101.100"
process.env.N_CPUS = require('os').cpus().length
process.env.currentDebugFolder = `debug/operation-control/${YMD(new Date())}`
global.WORKSPACE_ZONE = [280, 0, 1200, 900]
checkDirs([process.env.folder, process.env.currentDebugFolder])
process.env.launch = `${YMD(new Date())}_${HMS(new Date())}`
global.is_test = process.env.is_test ? true : false