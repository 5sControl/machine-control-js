const fs = require('fs')
const crypto = require('crypto')
const Drawer = require('./Drawer')
const {djangoDate} = require('../utils/Date')

const report = {
    photos: [],
    async add(snapshot, isDanger) {
        let drawedBuffer = await new Drawer(snapshot.buffer).draw_detections(snapshot, isDanger)
        const imagePath = this.upload(drawedBuffer)
        const photoRecord = {"image": imagePath, "date": djangoDate(new Date(snapshot.received))}
        this.photos.push(photoRecord)
    },
    /**
     * @param {Buffer} buffer from Drawer
     * @returns {string} imagePath
     */
    upload(buffer) {
        const imagePath = `images/${process.env.camera_ip}/${crypto.randomUUID()}.jpeg`
        fs.writeFile(
            imagePath,
            buffer,
            error => { if (error) console.log(error) }
        )
        return imagePath
    },
    send(extra) {
        const json = {
            "algorithm": "machine_control_js",
            "camera": process.env.camera_ip,
            "start_tracking": this.photos[0].date,
            "stop_tracking": this.photos[this.photos.length - 1].date,
            "photos": this.photos,
            "violation_found": true,
            "extra": extra
        }
        const body = JSON.stringify(json, null, 2)
        fetch(`${process.env.server_url}:80/api/reports/report-with-photos/`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body
        })
        .then(r => r.text())
        .then(response => { dispatcher.emit("server response", {message: response}) })
        .catch(err => { dispatcher.emit("error report send", {message: err.code}) })
        dispatcher.emit("report sended", {message: `json: ${body}\n\n`})
        this.photos = []
    }
}

dispatcher.on("machine control report ready", async ({snapshots, extra}) => {
    for (const [i, snapshot] of snapshots.entries()) {
        await report.add(snapshot, isDanger = [1,2].includes(i))
    }
    report.send(extra)
})