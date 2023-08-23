class EventAccumulator {

    accumulator = 0
    LIMIT = 5
    snapshot

    constructor(outcome_event_name, income_event_name, cleanup_event_name, zoneId) {
        dispatcher.on(income_event_name, ({snapshot, zoneId}) => this.accumulate(snapshot, zoneId))
        dispatcher.on(cleanup_event_name, ({zoneId}) => this.clean(zoneId))
        this.name = outcome_event_name
        this.zoneId = zoneId
    }
    accumulate(snapshot, zoneId) {
        if (this.zoneId === zoneId) {
            this.accumulator++
            console.log(this.zoneId, this.accumulator, this.name)
            const new_snapshot = structuredClone(snapshot)
            new_snapshot.zoneBbox = global.ZONES[this.zoneId].bbox
            this.snapshot = new_snapshot
            this.is_enought()
        }
    }
    is_enought() {
        if (this.accumulator > this.LIMIT) {
            dispatcher.emit(this.name, {snapshot: this.snapshot, zoneId: this.zoneId})
            this.clean()
        }
    }
    clean(zoneId) {
        if (this.zoneId === zoneId) this.accumulator = 0
    }
}

module.exports = EventAccumulator