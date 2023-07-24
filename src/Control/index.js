const EventAccumulator = require("./EventAccumulator")
const worker_out_workplace = new EventAccumulator("worker out workplace", "worker not detected", "worker detected")
const worker_at_workplace = new EventAccumulator("worker at workplace", "worker detected", "worker not detected")

const EventRegion = require('./EventRegion')
const machine_control = new EventRegion(worker_out_workplace, worker_at_workplace)