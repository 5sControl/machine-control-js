require('./globals')
require('./Translation')
require('./Control')
require('./Report')

dispatcher.emit("container started", { message: `
server_url: ${process.env.server_url}
camera_ip: ${process.env.camera_ip}
folder: ${process.env.folder}
extra: ${process.env.extra}
`
})