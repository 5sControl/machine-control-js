const ModelWorker = require('./workers/ModelWorker')
const loadYoloNAS = require('./models/yolo-nas')
const {bboxAtWorkspace} = require('../utils/2D')
// const {createCanvas, Image} = require('@napi-rs/canvas')

class Detector {

    model
    
    constructor() {
        if (!this.model) {
            console.time(`detector model load`)
            loadYoloNAS()
            .then(model => this.model = model)
            // this.model = new ModelWorker("nas")
            console.timeEnd(`detector model load`)
        }
    }
    async detect(buffer) {
        // const detections = await this.model.exec(buffer)
        console.time("detect")
        const detections = await this.model.detect(buffer)
        const worker_detection = detections?.find(d => d.class === 'person' && d.score > 0.5 && bboxAtWorkspace(d.bbox, WORKSPACE_ZONE))
        console.timeEnd("detect")
        return { worker_detection }
    }
    // async cutRegionFromBlob(buffer, region) {
    
    //     let canvas = createCanvas(1920, 1080)
    //     let ctx = canvas.getContext('2d')
    //     const image = new Image()
    //     image.src = buffer
    //     ctx.drawImage(image, 0, 0)

    //     const [x, y, width, height] = region
    //     const OFFSET = 20
    //     let cuttedWorker = ctx.getImageData(x - OFFSET, y - OFFSET, width + OFFSET, height + OFFSET)

    //     let newCan = createCanvas(width + OFFSET, height + OFFSET)
    //     let newCtx = newCan.getContext('2d')
    //     newCtx.putImageData(cuttedWorker, 0, 0)
    //     const croppedBlob = await newCan.encode('jpeg', 90)
    //     return croppedBlob
    // }
    async detectBatch(batch) {
        const prev = Date.now()
        let workers = []
        batch.forEach(snapshot => workers.push(this.detect(snapshot.buffer)))
        const detectionsArray = await Promise.all(workers)
        const now = Date.now()
        console.log(`batch detection - ${now - prev}ms`)
        detectionsArray.forEach((detections, i) => {
            batch[i].detections = detections
            const event = detections.worker_detection ? "worker detected" : "worker not detected"
            dispatcher.emit(event, {snapshot: batch[i], notForConsole: true })
        })
        dispatcher.emit("batch detections ready", { batch, notForConsole: true })
    }
    
}

const detector = new Detector()
// dispatcher.on("batch ready", async ({batch}) => detector.detectBatch(batch))
dispatcher.on("new snapshot received", async ({snapshot}) => {
    const detections = await detector.detect(snapshot.buffer)
    snapshot.detections = detections
    const event = detections.worker_detection ? "worker detected" : "worker not detected"
    dispatcher.emit(event, {snapshot, notForConsole: true })
})