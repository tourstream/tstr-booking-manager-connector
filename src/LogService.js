class LogService {
    constructor() {
        this.connectorVersion = require('package.json').version;
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    info(message) {
        this.log(message, 'info');
    }

    warn(message) {
        this.log(message, 'warn');
    }

    error(message) {
        this.log(message, 'error');
    }

    log(message, type = 'log') {
        if (!this.enabled) {
            return;
        }

        window.console[type]('[BMConnector v' + this.connectorVersion + '] ' + message);
    }
}

export {
    LogService as default,
}
