import injector from 'inject!../../src/BookingManagerConnector';
import {DEFAULT_OPTIONS, SERVICE_TYPES} from '../../src/BookingManagerConnector';

describe('BookingManagerConnector', () => {
    let adapter, BookingManagerConnector, penpal;

    beforeEach(() => {
        let logService = require('tests/unit/_mocks/LogService')();

        penpal = require('tests/unit/_mocks/Penpal')();

        BookingManagerConnector = injector({
            'penpal': penpal,
        });

        adapter = new BookingManagerConnector.default(logService, DEFAULT_OPTIONS);
    });

    it('connect() should connect', (done) => {
        penpal.connectToParent.and.returnValue({ promise: Promise.resolve() });

        adapter.connect();

        expect(penpal.connectToParent).toHaveBeenCalledWith({});

        done();
    });

    it('connect() should throw error', (done) => {
        penpal.connectToParent.and.returnValue({ promise: Promise.reject(new Error('connection.error')) });

        adapter.connect().then(() => {
            done.fail('unexpected result');
        }, (e) => {
            expect(e.message).toBe('Instantiate connection error: connection.error');
            done();
        });
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
            bmApi = require('tests/unit/_mocks/BookingManagerApi')();

            connection = require('tests/unit/_mocks/BookingManagerConnection')();
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
