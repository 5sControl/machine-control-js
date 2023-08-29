const {createCanvas, Image} = require("@napi-rs/canvas")

async function cutRegionFromBlob(buffer, region) {
    const [cHeight, cWidth] = [1080, 1920]
    let canvas = createCanvas(cWidth, cHeight)
    let ctx = canvas.getContext('2d')
    const image = new Image()
    image.src = buffer
    ctx.drawImage(image, 0, 0)
    const [x, y, width, height] = region
    const OFFSET = 20
    let cuttedWorker = ctx.getImageData(x - OFFSET, y - OFFSET, width + OFFSET, height + OFFSET)
    let newCan = createCanvas(width + OFFSET, height + OFFSET)
    let newCtx = newCan.getContext('2d')
    newCtx.putImageData(cuttedWorker, 0, 0)
    const croppedBlob = await newCan.encode('jpeg', 90)
    return croppedBlob
}

module.exports = { cutRegionFromBlob }