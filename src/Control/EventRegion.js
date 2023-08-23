class EventRegion {

    name = "machine control report"

    is_start = false
    snapshots = []

    constructor(income_event, outcome_event, zoneId) {
        this.income_event = income_event
        this.outcome_event = outcome_event
        this.zoneId = zoneId
        dispatcher.on(income_event.name, () => this.start())
        dispatcher.on(outcome_event.name, () => this.finish())
    }
    start() {
        if (this.is_start) return
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
    finish() {
        if (!this.is_start) return
        console.log(`----> ${this.name} finished`)
        this.is_start = false
        console.log(`----> get buffer before finish event: ${this.income_event.name}`, typeof this.income_event.snapshot.buffer)
        this.snapshots.push(this.income_event.snapshot)
        console.log(`----> get buffer finish event: ${this.outcome_event.name}`, typeof this.outcome_event.snapshot.buffer)
        this.snapshots.push(this.outcome_event.snapshot)
        const extra = { "zoneId": this.zoneId, "zoneName": global.ZONES[this.zoneId].zoneName }
        dispatcher.emit("machine control report ready", {snapshots: this.snapshots, extra})
        // console.log(`--------> send ${this.name}`, this.snapshots)
        this.snapshots = []
    }

}

module.exports = EventRegion