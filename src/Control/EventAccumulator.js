class EventAccumulator {

    accumulator = 0
    LIMIT = 10
    snapshot

    constructor(outcome_event_name, income_event_name, cleanup_event_name, zoneId) {
        dispatcher.on(income_event_name, ({snapshot, zoneId}) => this.accumulate(snapshot, zoneId))
        dispatcher.on(cleanup_event_name, () => this.clean())
        this.name = outcome_event_name
        this.zoneId = zoneId
    }
    accumulate(snapshot, zoneId) {
        if (this.zoneId === zoneId) {
            this.accumulator++
            this.snapshot = snapshot
            this.is_enought()
        }
    }
    is_enought() {
        if (this.accumulator > this.LIMIT) {
            dispatcher.emit(this.name, {snapshot: this.snapshot})
            this.clean()
        }
    }
    clean() {
        this.accumulator = 0
    }
}

module.exports = EventAccumulator