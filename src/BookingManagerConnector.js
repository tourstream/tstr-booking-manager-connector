import '@babel/polyfill';
import LogService from 'LogService';
import Penpal from 'penpal';
import moment from 'moment';

const DATA_TYPES = {
    car: 'car',
    hotel: 'hotel',
    roundTrip: 'roundtrip',
    camper: 'camper',
};

const DEFAULT_OPTIONS = {
    debug: false,
    useDateFormat: 'YYYY-MM-DD',
    useTimeFormat: 'HH:mm',
};

const CONFIG = {
    dateFormat: 'YYYY-MM-DD',   // ISO 8601
    timeFormat: 'HH:mm',        // ISO 8601
};

const TYPE_2_DATE_PROPERTIES = {
    [DATA_TYPES.car]: ['pickUp.date', 'dropOff.date', 'travellers.dateOfBirth'],
    [DATA_TYPES.hotel]: ['booking.fromDate', 'booking.toDate', 'travellers.dateOfBirth'],
    [DATA_TYPES.roundTrip]: ['booking.fromDate', 'booking.toDate', 'route.fromDate', 'route.toDate', 'travellers.dateOfBirth'],
    [DATA_TYPES.camper]: ['pickUp.date', 'dropOff.date', 'travellers.dateOfBirth'],
};

const TYPE_2_TIME_PROPERTIES = {
    [DATA_TYPES.car]: ['pickUp.time', 'dropOff.time'],
    [DATA_TYPES.camper]: ['pickUp.time', 'dropOff.time'],
};

class BookingManagerConnector {
    constructor(options = {}) {
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.logger = new LogService();
        this.connectorVersion = require('package.json').version;

        Penpal.debug = options.debug;
    }

    connect() {
        return this.createConnection();
    }

    addToBasket(data) {
        return this.getConnection().promise.then(parent => {
            let transferObject = this.convertDataToTransferObject(data);

            this.logger.log('TRANSFER DATA');
            this.logger.log(transferObject);

            return parent.addToBasket(transferObject);
        });
    }

    directCheckout(data) {
        return this.getConnection().promise.then(parent => {
            let transferObject = this.convertDataToTransferObject(data);

            this.logger.log('TRANSFER DATA');
            this.logger.log(transferObject);

            return parent.directCheckout(transferObject);
        });
    }

    done() {
        return this.getConnection().promise.then(parent => {
            return parent.done();
        });
    }

    /**
     * @private
     */
    createConnection() {
        this.connection = Penpal.connectToParent({});

        return this.connection.promise.catch((error) => {
            this.logger.error(error);
            throw new Error('Instantiate connection error: ' + error.message);
        });
    }

    /**
     * @private
     * @returns {*}
     */
    getConnection() {
        if (this.connection) {
            return this.connection;
        }

        throw new Error('No connection available - please connect to Booking Manager first.');
    }

    /**
     * @private
     *
     * @param data
     * @returns {*}
     */
    convertDataToTransferObject(data) {
        this.logger.log('INPUT DATA');
        this.logger.log(data);

        if (this.options.useDateFormat !== CONFIG.dateFormat) {
            this.convertDateProperties(data, TYPE_2_DATE_PROPERTIES[data.type]);
        }

        if (this.options.useTimeFormat !== CONFIG.timeFormat) {
            this.convertTimeProperties(data, TYPE_2_TIME_PROPERTIES[data.type]);
        }

        data._ = {
            version: this.connectorVersion,
        };

        return data;
    }

    convertDateProperties(data, propertyList = []) {
        propertyList.forEach((propertyPath) => {
            this.convertValueByPropertyPath(data, propertyPath, this.convertDateValue.bind(this));
        });
    }

    convertTimeProperties(data, propertyList = []) {
        propertyList.forEach((propertyPath) => {
            this.convertValueByPropertyPath(data, propertyPath, this.convertTimeValue.bind(this));
        });
    }

    convertValueByPropertyPath(object, path, callback) {
        let parts = path.split('.');
        let property = parts.shift();

        if (object === void 0) {
            return;
        }

        if (path === property) {
            object[property] = callback(object[property]);

            return;
        }

        if (Array.isArray(object[property])) {
            object[property].forEach((item) => this.convertValueByPropertyPath(item, parts.join('.'), callback));

            return;
        }

        this.convertValueByPropertyPath(object[property], parts.join('.'), callback);
    }

    /**
     * @private
     * @param date string
     * @returns {string}
     */
    convertDateValue(date) {
        let dateObject = moment(date, this.options.useDateFormat);

        return dateObject.isValid() ? dateObject.format(CONFIG.dateFormat) : date;
    }

    /**
     * @private
     * @param time string
     * @returns {string}
     */
    convertTimeValue(time) {
        let timeObject = moment(time, this.options.useTimeFormat);

        return timeObject.isValid() ? timeObject.format(CONFIG.timeFormat) : time;
    }
}

export {
    DATA_TYPES,
    DEFAULT_OPTIONS,
    BookingManagerConnector as default,
};
