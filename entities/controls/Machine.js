const {Control} = require('../Control')
const Snapshot = require('../Snapshot')

class Machine extends Control {

    ENOUGH_TIME_FOR_GETTING_PHOTO = 15 // seconds
    ENOUGH_TIME_FOR_GETTING_SECOND_PHOTO = 25 // seconds

    potentialMachinesCounter = 0

    photoWithPerson1
    photoWithoutPerson1
    photoWithoutPerson2

    constructor(...args) {
        super(...args)
        this.allowedTime = 30
    }

    check() {

        let isPersonFound = this.isAnyDetections(["person"], "boolean")

        if (isPersonFound && this.potentialMachinesCounter < this.allowedTime) {
            this.photosForReport = []
            this.photoWithoutPerson1 = null
            this.photoWithoutPerson2 = null
            this.potentialMachinesCounter = 0
            this.photoWithPerson1 = new Snapshot(this.camera.snapshot.buffer)
        }

        if (!isPersonFound && this.photoWithPerson1) {
            this.potentialMachinesCounter++
            if (!this.photoWithoutPerson1 && this.potentialMachinesCounter > this.ENOUGH_TIME_FOR_GETTING_PHOTO) {
                this.photoWithoutPerson1 = new Snapshot(this.camera.snapshot.buffer)
            }
            if (this.photoWithoutPerson1 && !this.photoWithoutPerson2 && this.potentialMachinesCounter > this.ENOUGH_TIME_FOR_GETTING_SECOND_PHOTO) {
                this.photoWithoutPerson2 = new Snapshot(this.camera.snapshot.buffer)
            }
        }

        if (isPersonFound && this.potentialMachinesCounter >= this.allowedTime) {
            const withoutPerson1 = this.photoWithoutPerson1
            const withoutPerson2 = this.photoWithoutPerson2
            const withPerson1 = this.photoWithPerson1
            const withPerson2 = new Snapshot(this.camera.snapshot.buffer)
            this.photosForReport = [withPerson1, withoutPerson1, withoutPerson2, withPerson2]
            this.sendReport()

            this.photoWithoutPerson1 = null
            this.photoWithoutPerson2 = null
            this.photoWithPerson1 = null
            this.potentialMachinesCounter = 0
        }

    }

    static getVersion() {
        return {
            name: "Machine Control JS",
            version: "v0.1.0",
            date: '03.23.2023',
            description: 'Designed to ensure that the machine is not left unsupervised, which' +
                ' could lead to accidents, breakdowns, or other issues (downtime & lost profits). ' +
                'This control is essential in workplaces where machines are used, such as factories, ' +
                'construction sites, or warehouses.',
        }
    }

}

module.exports = Machine