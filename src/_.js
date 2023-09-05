require('./globals')
require('./Translation')
require('./Control')
require('./Report')

dispatcher.emit("container started", { message: `
folder: ${process.env.folder}
server_url: ${process.env.server_url}
socket_server: ${process.env.socket_server}
`
})