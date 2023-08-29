const loadYoloNAS = require('./models/yolo-nas')

class Detector {
    model
    constructor() {
        if (!this.model) {
            console.time(`detector model load`)
            loadYoloNAS()
            .then(model => this.model = model)
            console.timeEnd(`detector model load`)
        }
    }
    async detect(buffer, bbox) {
        console.time("detect")
        const detections = await this.model.detect(buffer, bbox)
        console.timeEnd("detect")
        return detections
    }
}

const detector = new Detector()

module.exports = detector