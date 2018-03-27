import injector from 'inject!../../src/BookingManagerConnector';
import {DEFAULT_OPTIONS, DATA_TYPES} from '../../src/BookingManagerConnector';

describe('BookingManagerConnector', () => {
    let adapter, BookingManagerConnector, penpal;

    beforeEach(() => {
        penpal = require('tests/unit/_mocks/Penpal')();

        BookingManagerConnector = injector({
            'penpal': penpal,
        });

        adapter = new BookingManagerConnector.default({
            useDateFormat: 'YYYYMMDD',
            useTimeFormat: 'HHmm'
        });
    });

    it('DEFAULT_OPTIONS should be correct', () => {
        expect(DEFAULT_OPTIONS).toEqual({
            debug: false,
            useDateFormat: 'YYYY-MM-DD',
            useTimeFormat: 'HH:mm',
        });
    });

    it('DATA_TYPES should be correct', () => {
        expect(DATA_TYPES).toEqual({
            car: 'car',
            hotel: 'hotel',
            roundTrip: 'roundtrip',
            camper: 'camper',
        });
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
        expect(adapter.done.bind(adapter)).toThrowError(message);
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
            let expected = {
                _: { version: jasmine.anything() },
            };

            bmApi.addToBasket.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.addToBasket(data).catch((error) => {
                console.log(error.toString());
                done.fail('unexpected result');
            });
        });

        it('addToBasket() should set data correct', (done) => {
            let data = { string: 'data', array: [], object: {}, number: 0, boolean: false };

            let expected = {
                _: { version: jasmine.anything() },
                string: 'data',
                array: [],
                object: {},
                number: 0,
                boolean: false,
            };

            bmApi.addToBasket.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.addToBasket(data).catch((error) => {
                console.log(error.toString());
                done.fail('unexpected result');
            });
        });

        it('directCheckout() should set data correct', (done) => {
            let data = { string: 'data', array: [], object: {}, number: 0, boolean: false };

            let expected = {
                _: { version: jasmine.anything() },
                string: 'data',
                array: [],
                object: {},
                number: 0,
                boolean: false,
            };

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data).catch((error) => {
                console.log(error.toString());
                done.fail('unexpected result');
            });
        });

        it('conversion of car values should work correct', (done) => {
            let data = {
                type: DATA_TYPES.car,
                pickUp: {
                    date: '20181108',
                    time: '0920',
                },
                dropOff: {
                    date: '20181110',
                    time: '0930',
                },
            };

            let expected = {
                _: { version: jasmine.anything() },
                type: DATA_TYPES.car,
                pickUp: {
                    date: '2018-11-08',
                    time: '09:20',
                },
                dropOff: {
                    date: '2018-11-10',
                    time: '09:30',
                },
            };

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data).catch((error) => {
                console.log(error.toString());
                done.fail('unexpected result');
            });
        });

        it('conversion of hotel values should work correct', (done) => {
            let data = {
                type: DATA_TYPES.hotel,
                booking: {
                    fromDate: '20181108',
                    toDate: '20181118',
                },
            };

            let expected = {
                _: { version: jasmine.anything() },
                type: DATA_TYPES.hotel,
                booking: {
                    fromDate: '2018-11-08',
                    toDate: '2018-11-18',
                },
            };

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data).catch((error) => {
                console.log(error.toString());
                done.fail('unexpected result');
            });
        });

        it('conversion of roundTrip values should work correct', (done) => {
            let data = {
                type: DATA_TYPES.roundTrip,
                booking: {
                    fromDate: '20181108',
                    toDate: '20181118',
                },
                route: [
                    {
                        fromDate: '20181207',
                        toDate: '20181217',
                    },
                ],
            };

            let expected = {
                _: { version: jasmine.anything() },
                type: DATA_TYPES.roundTrip,
                booking: {
                    fromDate: '2018-11-08',
                    toDate: '2018-11-18',
                },
                route: [
                    {
                        fromDate: '2018-12-07',
                        toDate: '2018-12-17',
                    },
                ],
            };

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data).catch((error) => {
                console.log(error.toString());
                done.fail('unexpected result');
            });
        });

        it('should do no conversion if conversion result is wrong', (done) => {
            let data = {
                type: DATA_TYPES.car,
                pickUp: {
                    date: '08112018',
                    time: '920',
                },
            };

            let expected = {
                _: { version: jasmine.anything() },
                type: DATA_TYPES.car,
                pickUp: {
                    date: '08112018',
                    time: '920',
                },
            };

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data).catch((error) => {
                console.log(error.toString());
                done.fail('unexpected result');
            });
        });

        it('should do no conversion if use*Format is not defined', (done) => {
            let data = {
                type: DATA_TYPES.car,
                rental: {
                    date: '20181108',
                    time: '0920',
                },
            };

            let expected = {
                _: { version: jasmine.anything() },
                type: DATA_TYPES.car,
                rental: {
                    date: '20181108',
                    time: '0920',
                },
            };

            adapter = new BookingManagerConnector.default();
            adapter.connect();

            bmApi.directCheckout.and.callFake((data) => {
                expect(data).toEqual(expected);
                done();
            });

            adapter.directCheckout(data).catch((error) => {
                console.log(error.toString());
                done.fail('unexpected result');
            });
        });

        it('done() should trigger done on BM API', (done) => {
            bmApi.done.and.callFake(() => {
                done();
            });

            adapter.done().catch((error) => {
                console.log(error.toString());
                done.fail('unexpected result');
            });
        });
    });
});
