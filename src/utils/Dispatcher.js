const {EventEmitter} = require('events')

function Timestamp() {
	const date = new Date()
	const padTo2Digits = (num) => num.toString().padStart(2, '0')
	return (
		[
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
		].join('-')
            + ' ' +
		[
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds())
		].join(':')
		+ '.' +
		date.getMilliseconds()
	)
}

class Dispatcher extends EventEmitter {
    emit(eventName, options) {
        super.emit(eventName, options)
        if (!options?.notForConsole) {
            const message = options?.message
            const record = `${Timestamp()}: ${eventName}${message ? `\n${message}` : "" }`
            console.log(`\x1b[34m%s\x1b[0m`, record)        
        }
    }
}

const dispatcher = new Dispatcher()

module.exports = dispatcher