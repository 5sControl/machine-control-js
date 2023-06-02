const Camera = require('./entities/Camera');
const Machine = require("./entities/controls/Machine");


const {camera_url, folder, server_url} = process.env;

const run = async () => {
    const camera = new Camera()
    const reqBody = {algorithm: 'machine_control', camera_url, server_url, extra: []}
    const SERVER_IP = server_url.split('//')[1]
    const cameraInterval = await camera.init(reqBody, false, SERVER_IP)
    const createdAlgorithm = new Machine(cameraInterval.camera, 'machine_control', [])
    const algorithmInterval = await createdAlgorithm.start(cameraInterval.camera)
}

run()




