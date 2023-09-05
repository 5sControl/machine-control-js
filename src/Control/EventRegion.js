class EventRegion {

    name = "machine control report"

    is_start = false
    snapshots = []

    constructor(income_event, outcome_event, zoneId) {
        this.income_event = income_event
        this.outcome_event = outcome_event
        this.zoneId = zoneId
        dispatcher.on(income_event.name, ({zoneId}) => this.start(zoneId))
        dispatcher.on(outcome_event.name, ({zoneId}) => this.finish(zoneId))
    }
    start(zoneId) {
        if (this.is_start) return
        if (this.zoneId !== zoneId) return
        this.is_start = true
        console.log(`----> ${this.name} start`)
        console.log(`----> get buffer before start event: ${this.outcome_event.name}`, typeof this.outcome_event.snapshot?.buffer)
        if (this.outcome_event.snapshot) {
            this.snapshots.push(this.outcome_event.snapshot)
        } else {
            console.log(`container started without worker at workspace, duplicate second photo`)
            this.snapshots.push(this.income_event.snapshot)
        }
        console.log(`----> get buffer start event: ${this.income_event.name}`, typeof this.income_event.snapshot.buffer)
        this.snapshots.push(this.income_event.snapshot)
    }
    async finish(zoneId) {
        if (!this.is_start) return
        if (this.zoneId !== zoneId) return
        console.log(`----> ${this.name} finished, ${this.zoneId}`)
        this.is_start = false
        console.log(`----> get buffer before finish event: ${this.income_event.name}`, typeof this.income_event.snapshot.buffer)
        this.snapshots.push(this.income_event.snapshot)
        console.log(`----> get buffer finish event: ${this.outcome_event.name}`, typeof this.outcome_event.snapshot?.buffer)
        this.snapshots.push(this.outcome_event.snapshot)
        const extra = { "zoneId": this.zoneId, "zoneName": global.ZONES[this.zoneId].zoneName }
        if (this.snapshots[0] != this.snapshots[1]) await this.send(this.snapshots, extra)
        console.log(`--------> ${this.name}`, this.snapshots)
        this.snapshots = []
    }
    async send(snapshots, extra) {
        let flattened_snapshots = structuredClone(snapshots)
        const form = new FormData()
        for (const snapshot of flattened_snapshots) {
            form.append("snapshots", new Blob([snapshot.buffer]))
            delete snapshot.buffer
        }
        form.append("flattened_snapshots", JSON.stringify(flattened_snapshots))
        form.append("extra", JSON.stringify(extra))
        form.append("camera_ip", process.env.camera_ip)
        try {
            const response = await fetch(`${process.env.server_url}:9999/report`, {
                method: "POST",
                body: form
            })
            console.log(await response.json())            
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = EventRegion