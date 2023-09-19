const io = require('socket.io-client')

/* >------------------------------------------------------------------------------------------------------------------------> **/
// subscription
    const socket = io(`${process.env.server_url}:9999`, {
        query: {
            camera_ip: process.env.camera_ip,
            zones: JSON.stringify(global.ZONES_bboxes)
        }
    })
    socket.on("connect", () => console.log(`\x1B[32m ✅ Your algorithm is subscribed to the inference server`))
    socket.on("disconnect", () => console.log(`\x1B[31m ❌ Your algorithm is unsubscribed to the inference server`))

/* <------------------------------------------------------------------------------------------------------------------------< **/
// get detected snapshot

    socket.on("snapshot detected", (snapshot) => dispatcher.emit("snapshot detected", {snapshot}))

/* >------------------------------------------------------------------------------------------------------------------------> **/
// send ready report

    dispatcher.on("machine control report ready", async ({snapshots, extra}) => {
        socket.emit("send report", {snapshots, extra }, (response) => console.log(response.status))
    })

/* ------------------------------------------------------------------------------------------------------------------------ **/