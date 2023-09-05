require('./globals')
require('./Translation')
require('./Control')

dispatcher.emit("container started", { message: `
server_url: ${process.env.server_url}
camera_ip: ${process.env.camera_ip}
extra: ${process.env.extra}
`
})