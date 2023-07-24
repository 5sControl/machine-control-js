const fs = require('fs')
const crypto = require('crypto')
const Drawer = require('./Drawer')
const {djangoDate} = require('../utils/Date')

const report = {
    photos: [],
    async add(snapshot) {
        let drawedBuffer = await new Drawer(snapshot.buffer).draw_detections(snapshot.detections)
        const imagePath = this.upload(drawedBuffer)
        console.log(snapshot)
        const photoRecord = {"image": imagePath, "date": djangoDate(new Date(snapshot.received))}
        this.photos.push(photoRecord)
    },
    /**
     * @param {Buffer} buffer from Drawer
     * @returns {string} imagePath
     */
    upload(buffer) {
        const imagePath = `${process.env.folder}/${crypto.randomUUID()}.jpeg`
        fs.writeFile(
            imagePath,
            buffer,
            error => { if (error) console.log(error) }
        )
        return imagePath
    },
    send(extra) {
        const json = {
            "algorithm": "machine_control",
            "camera": process.env.folder?.split("/")[1],
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

dispatcher.on("machine control report ready", async ({snapshots}) => {
    for (const snapshot of snapshots) await report.add(snapshot)
    report.send({ "zoneId": 54, "zoneName": "zone1" })
})