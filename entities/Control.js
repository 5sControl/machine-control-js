const loadYoloV8 = require('../models/yolov8')
const Snapshot = require('./Snapshot')
const Report = require('./Report')
const setColor = colorCode => `\x1b[${colorCode}m%s\x1b[0m`
let CONSOLE_COLORS = {
    "standart": setColor("33")
}
const MODELS_PATH = {
    "standart": "./yolov8m/model.json"
}

class Control {

    camera
    model
    predictions
    timer

    algorithmName
    controlType

    // options
    CHECK_TIME = 1000
    allowedTime = 10 // seconds    

    photosForReport = []

    _version = "1.0.0"

    constructor(camera, algorithm, extra) {
        this.camera = camera
        this.algorithmName = algorithm
        this.controlType = algorithm
        this.debugColor = CONSOLE_COLORS["standart"]
    }

    async loadModels() {
        if (!this.model) {
            console.time(`${this.controlType} model load`)
            let modelPath = MODELS_PATH["standart"]
            this.model = await loadYoloV8(modelPath)
            console.timeEnd(`${this.controlType} model load`)
        }
    }

    async start(isWithTimer = true) {
        await this.loadModels()
        if (isWithTimer) {
            this.timer = setInterval(async () => await this.getPredictions(), this.CHECK_TIME)
            console.log(this.debugColor, `${this.controlType} control started`)
            return this.timer
        }
    }

    async getPredictions() {
        try {
            if (!this.camera.snapshot.buffer) return
            this.predictions = null
            try {
                const prev = Date.now()
                this.predictions = await this.model.detect(this.camera.snapshot.buffer)
                const now = Date.now()
                console.log(`${this.controlType} model detection ${now - prev}ms`)
            } catch (error) {
                console.log(error, 'setInterval error')
            }
            if (!this.predictions) return
            this.check()
        } catch (e) {
            console.log(e, 'e')
        }
    }

    update() {
    }

    async detect() {
    }

    check() {
    }

    isPeopleOnFrame() {
        return !!this.predictions.length
    }

    /**
     * @param {string[]} classes Classes to detect
     * @param {number} minScore Minimum detection score
     * @param {("array" | "boolean")} returnType What type to return
     */
    isAnyDetections(classes, returnType = "array", minScore = 0.5) {
        const checkClass = prediction => classes === undefined ? true : classes.includes(prediction.class)
        const isReturnArray = returnType === "array" ? true : false
        let detection = isReturnArray ? [] : false
        const predictions = this.predictions

        try {
            for (const prediction of predictions) {
                if (checkClass(prediction) && prediction.score > minScore) {
                    isReturnArray ? detection.push(prediction) : detection = true
                }
            }
        } catch (error) {
            console.log(error)
        }
        return detection
    }

    erasePhotosIfArrayIsEmpty(array) {
        array.length > 0 ?
            this.photosForReport = [...this.photosForReport, new Snapshot(this.camera.snapshot.buffer)]
            : this.photosForReport = []
    }

    sendReportIfPhotosEnough() {
        if (this.photosForReport.length === this.allowedTime) this.sendReport()
    }

    sendReport(controlPayload) {
        const report = new Report(this.camera.serverUrl, this.camera.hostname, this.algorithmName, this.photosForReport, controlPayload)
        report.send()
        this.photosForReport = []
    }

}

module.exports = {Control}
