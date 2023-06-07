const Camera = require('./entities/Camera');
const Machine = require("./entities/controls/Machine");


const {camera_url, folder, server_url} = process.env;

const run = async () => {
    const camera = new Camera()
    const reqBody = {algorithm: 'machine_control', camera_url, server_url, extra: []}
    const cameraInterval = await camera.init(reqBody, false, folder)
    const createdAlgorithm = new Machine(cameraInterval.camera, 'machine_control', [])
    const algorithmInterval = await createdAlgorithm.start(cameraInterval.camera)
}

run()




