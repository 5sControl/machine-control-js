require('./globals')
require('./socket')
require('./Control')

console.log("container started", `
time: ${new Date()}
server_url: ${process.env.server_url}
camera_ip: ${process.env.camera_ip}
extra: ${process.env.extra}
algorithm_name: ${process.env.algorithm_name}
`)