class EventAccumulator {

    accumulator = 0
    LIMIT = 10
    snapshot

    constructor(outcome_event_name, income_event_name, cleanup_event_name) {
        dispatcher.on(income_event_name, ({snapshot}) => this.accumulate(snapshot))
        dispatcher.on(cleanup_event_name, () => this.clean())
        this.name = outcome_event_name
    }
    accumulate(snapshot) {
        this.accumulator++
        this.snapshot = snapshot
        this.is_enought()
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