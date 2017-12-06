import es6shim from 'es6-shim';
import LogService from 'LogService';
import Penpal from 'penpal';
import moment from 'moment';

const SERVICE_TYPES = {
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

class BookingManagerConnector {
    constructor(options) {
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.logger = new LogService();

        Penpal.debug = options.debug;
    }

    connect() {
        return this.createConnection();
    }

    addToBasket(dataObject) {
        return this.getConnection().promise.then(parent => {
            let rawObject = this.mapDataObjectToRawObject(dataObject);

            this.logger.log('RAW DATA');
            this.logger.log(rawObject);

            return parent.addToBasket(rawObject);
        });
    }

    directCheckout(dataObject) {
        return this.getConnection().promise.then(parent => {
            let rawObject = this.mapDataObjectToRawObject(dataObject);

            this.logger.log('RAW DATA');
            this.logger.log(rawObject);

            return parent.directCheckout(rawObject);
        });
    }

    exit() {
        this.getConnection().destroy();

        return Promise.resolve();
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
     */
    mapDataObjectToRawObject(dataObject) {
        (dataObject.services || []).forEach((service) => {
            switch (service.type) {
                case SERVICE_TYPES.car: {
                    this.convertCarService(service);
                    break;
                }
                case SERVICE_TYPES.hotel: {
                    this.convertHotelService(service);
                    break;
                }
                case SERVICE_TYPES.roundTrip: {
                    this.convertRoundTripService(service);
                    break;
                }
                case SERVICE_TYPES.camper: {
                    this.convertCamperService(service);
                    break;
                }
            }
        });

        return dataObject;
    }

    /**
     * @private
     * @param service object
     */
    convertCarService(service) {
        service.pickUpDate = this.convertDateValue(service.pickUpDate);
        service.pickUpTime = this.convertTimeValue(service.pickUpTime);
    }

    /**
     * @private
     * @param service object
     */
    convertHotelService(service) {
        service.dateFrom = this.convertDateValue(service.dateFrom);
        service.dateTo = this.convertDateValue(service.dateTo);
    }

    /**
     * @private
     * @param service object
     */
    convertRoundTripService(service) {
        service.startDate = this.convertDateValue(service.startDate);
        service.endDate = this.convertDateValue(service.endDate);
    }

    /**
     * @private
     * @param service object
     */
    convertCamperService(service) {
        service.pickUpDate = this.convertDateValue(service.pickUpDate);
        service.dropOffDate = this.convertDateValue(service.dropOffDate);
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
    SERVICE_TYPES,
    DEFAULT_OPTIONS,
    BookingManagerConnector as default,
};
