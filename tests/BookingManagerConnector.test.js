import injector from 'inject!../src/BookingManagerConnector';
import {DEFAULT_OPTIONS, SERVICE_TYPES} from '../src/BookingManagerConnector';

describe('BookingManagerConnector', () => {
    let adapter, BookingManagerConnector, penpal;

    beforeEach(() => {
        let logService = require('tests/_mocks/LogService')();

        penpal = require('tests/_mocks/Penpal')();

        BookingManagerConnector = injector({
            'penpal': penpal,
        });

        adapter = new BookingManagerConnector.default(logService, DEFAULT_OPTIONS);
    });

    it('connect() should connect', () => {
        adapter.connect();

        expect(penpal.connectToParent).toHaveBeenCalledWith({});
    });

    it('connect() should throw error', () => {
        penpal.connectToParent.and.throwError('connection.error');

        expect(adapter.connect.bind(adapter)).toThrowError('Instantiate connection error: connection.error');
    });

    it('connect() should throw error if no connection is available', () => {
        let message = 'No connection available - please connect to Booking Manager first.';

        expect(adapter.addToBasket.bind(adapter)).toThrowError(message);
        expect(adapter.directCheckout.bind(adapter)).toThrowError(message);
        expect(adapter.exit.bind(adapter)).toThrowError(message);
    });

    describe('is connected and', () => {
        let connection, bmApi;

        beforeEach(() => {
            bmApi = require('tests/_mocks/BookingManagerApi')();

            connection = require('tests/_mocks/BookingManagerConnection')();
            connection.promise = Promise.resolve(bmApi);

            penpal.connectToParent.and.returnValue(connection);

            adapter.connect();
        });

        it('addToBasket() should handle empty data', (done) => {
            let data = {};
            let expected = {};

            bmApi.addToBasket.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.addToBasket(data);
        });

        it('addToBasket() should set data correct', (done) => {
            let data = {
                services: [{
                    type: SERVICE_TYPES.car,
                    pickUpDate: '12072018',
                    pickUpTime: '0945',
                }, {
                    type: SERVICE_TYPES.hotel,
                    dateFrom: '22072018',
                    dateTo: '28072018',
                }, {
                    type: SERVICE_TYPES.roundTrip,
                    startDate: '02072018',
                    endDate: '08072018',
                }, {
                    type: SERVICE_TYPES.camper,
                    pickUpDate: '10072018',
                    dropOffDate: '20072018',
                }],
            };

            let expected = {
                services: [{
                    type: SERVICE_TYPES.car,
                    pickUpDate: '2018-07-12',
                    pickUpTime: '09:45',
                }, {
                    type: SERVICE_TYPES.hotel,
                    dateFrom: '2018-07-22',
                    dateTo: '2018-07-28',
                }, {
                    type: SERVICE_TYPES.roundTrip,
                    startDate: '2018-07-02',
                    endDate: '2018-07-08',
                }, {
                    type: SERVICE_TYPES.camper,
                    pickUpDate: '2018-07-10',
                    dropOffDate: '2018-07-20',
                }],
            };

            bmApi.addToBasket.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.addToBasket(data);
        });

        it('directCheckout() should set car data correct', (done) => {
            let data = {
                services: [{
                    type: SERVICE_TYPES.car,
                    vehicleTypeCode: 'vtc',
                    rentalCode: 'rc',
                    pickUpLocation: 'pu l',
                    pickUpDate: 'invalid pu d',
                    pickUpTime: 'invalid pu t',
                    dropOffLocation: 'do l',
                    durationInMinutes: 6215,
                    pickUpHotelName: 'puh n',
                    pickUpHotelAddress: 'puh a',
                    pickUpHotelPhoneNumber: 'puh pn',
                    dropOffHotelName: 'do hn',
                    dropOffHotelAddress: 'do ha',
                    dropOffHotelPhoneNumber: 'do hpn',
                    extras: ['e.2', 'e3.2', 'e'],
                }],
            };

            let expected = {
                services: [{
                    type: SERVICE_TYPES.car,
                    vehicleTypeCode: 'vtc',
                    rentalCode: 'rc',
                    pickUpLocation: 'pu l',
                    pickUpDate: 'invalid pu d',
                    pickUpTime: 'invalid pu t',
                    dropOffLocation: 'do l',
                    durationInMinutes: 6215,
                    pickUpHotelName: 'puh n',
                    pickUpHotelAddress: 'puh a',
                    pickUpHotelPhoneNumber: 'puh pn',
                    dropOffHotelName: 'do hn',
                    dropOffHotelAddress: 'do ha',
                    dropOffHotelPhoneNumber: 'do hpn',
                    extras: ['e.2', 'e3.2', 'e'],
                }],
            };

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data);
        });

        it('directCheckout() should set hotel data correct', (done) => {
            let data = {
                services: [{
                    type: SERVICE_TYPES.hotel,
                    roomCode: 'rc',
                    mealCode: 'mc',
                    roomQuantity: 'rq',
                    roomOccupancy: 'ro',
                    destination: 'd',
                    dateFrom: 'invalid df',
                    dateTo: 'invalid dt',
                    children: [{ name: 'john doe', age: '3' }],
                }],
            };

            let expected = {
                services: [{
                    type: SERVICE_TYPES.hotel,
                    roomCode: 'rc',
                    mealCode: 'mc',
                    roomQuantity: 'rq',
                    roomOccupancy: 'ro',
                    destination: 'd',
                    dateFrom: 'invalid df',
                    dateTo: 'invalid dt',
                    children: [{ name: 'john doe', age: '3' }],
                }],
            };

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data);
        });

        it('directCheckout() should set roundTrip data correct', (done) => {
            let data = {
                services: [{
                    type: SERVICE_TYPES.roundTrip,
                    bookingId: 'b id',
                    destination: 'd',
                    numberOfPassengers: 'nop',
                    startDate: 'invalid sd',
                    endDate: 'invalid ed',
                    title: 't',
                    name: 'n',
                    age: 'a',
                    birthday: 'b',
                }],
            };

            let expected = {
                services: [{
                    type: SERVICE_TYPES.roundTrip,
                    bookingId: 'b id',
                    destination: 'd',
                    numberOfPassengers: 'nop',
                    startDate: 'invalid sd',
                    endDate: 'invalid ed',
                    title: 't',
                    name: 'n',
                    age: 'a',
                    birthday: 'b',
                }],
            };

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data);
        });

        it('directCheckout() should set camper data correct', (done) => {
            let data = {
                services: [{
                    type: SERVICE_TYPES.camper,
                    renterCode: 'rc',
                    camperCode: 'cc',
                    pickUpLocation: 'pu l',
                    dropOffLocation: 'do l',
                    pickUpDate: 'invalid pu d',
                    dropOffDate: 'invalid do d',
                    milesIncludedPerDay: 'mipd',
                    milesPackagesIncluded: 'mpi',
                    extras: ['e.2', 'e3.2', 'e'],
                }],
            };

            let expected = {
                services: [{
                    type: SERVICE_TYPES.camper,
                    renterCode: 'rc',
                    camperCode: 'cc',
                    pickUpLocation: 'pu l',
                    dropOffLocation: 'do l',
                    pickUpDate: 'invalid pu d',
                    dropOffDate: 'invalid do d',
                    milesIncludedPerDay: 'mipd',
                    milesPackagesIncluded: 'mpi',
                    extras: ['e.2', 'e3.2', 'e'],
                }],
            };

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data);
        });

        it('exit() should destroy connection', () => {
            adapter.exit();

            expect(connection.destroy).toHaveBeenCalled();
        });
    });
});
