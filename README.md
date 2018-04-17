# === Booking Manager Connector ===

This project provides a JS module to enable an IBE to communicate with the FTI360 Booking Manager.


## How to install

There are different ways to use this package.


#### per package manager

`npm install @tourstream/tstr-booking-manager-connector --save`

```
import BookingManagerConnector from 'tstr-booking-manager-connector';

let bmConnector = new BookingManagerConnector(instanceOptions);
```


#### or link the source

```
<script src="https://assets.gcloud.fti-group.com/tstr-booking-manager-connector/<versionNumber>/bookingManagerConnector.min.js"></script>

<script>
  var bmConnector = new BookingManagerConnector.default(instanceOptions);
</script>
```

_versionNumber_ has to be one of the [provided versions](https://github.com/tourstream/tstr-booking-manager-connector/tags).
Alternatively you can use 'latest' to use the latest version.


### Supported `instanceOptions`

You can check the default options with `BookingManagerConnector.DEFAULT_OPTIONS`.

```
{
  debug: false,                 // en-/disable debugging
  useDateFormat: 'YYYY-MM-DD',  // the date format you want to use
  useTimeFormat: 'HH:mm',       // the time format you want to use
}
```

The formats are according to [momentjs date format](https://momentjs.com/docs/#/parsing/string-format/).


## Interface

The connector provides several functions for the communication with the BM.
```
bmConnector.connect();                    // establish the connection to the BM
bmConnector.addToBasket(dataObject);      // add an item to the basket of the BM (the user/TA have to do the CRS transfer manually)
bmConnector.directCheckout(dataObject);   // handover an item to the BM and mark it for "direct checkout" (the BM will do the CRS transfer automatically after "done" is executed)
bmConnector.done();                       // tell the BM to process the items and proceed with the BM workflow
```

Every method returns a promise.


### The `dataObject` structure

In general the `dataObject` must have at least one property to identify the type of your item:
```
{
  type: BookingManagerConnector.DATA_TYPES[*]
}
```

Currently the connector supports following types:
- `'car'`
- `'hotel'`
- `'roundtrip'`
- `'camper'`

Depending on the `type` the [structure of the `dataObject`](index.d.ts) differs.


#### example for type `'car'`

```
{
  type: BookingManagerConnector.DATA_TYPES.car,
  rental: {
    status: 'OK',
    editUrl: 'example://url-for.editing/?the=item',
    availabilityUrl: 'example://url-to-do.an/availability/check',
    conditionUrl: 'example://url-to-the.conditions',
    price: 506,
    currencyCode: 'EUR',
  },
  vehicle: {
    code: 'E2',
    category: 'SMALL_CAR',
    name: 'Chevrolet Spark 2-4T AU',
    imageUrl: 'example://url-to-vehicle.img',
  },
  renter: {
    code: 'USA81',
    name: 'Alamo',
    logoUrl: 'example://url-to-renter.logo',
  },
  pickUp: {
    type: 'station',
    date: '2017-12-28', 
    time: '09:15', 
    locationCode: 'MIA3',
    name: 'Alamo',
    address: '4332 Collins Avenue, Miami South Beach',
    phoneNumber: '(305) 532-8257',
    latitude: '25.8149316',
    longitude: '-80.1230047',
  },
  dropOff: {
    type: 'hotel',
    date: '2018-01-04', 
    time: '13:40', 
    locationCode: 'SFOH',
    name: 'Best Hotel',
    address: 'hotel street 1, 12345 hotel city',
    phoneNumber: '+49 172 678 0832 09',
    latitude: '37.6213129',
    longitude: '-122.3789554',
  },
  services: [
    'included service',
    '...',
  ],
  extras: [
    {
      type: 'additionalDriver',
      amount: 3,
      totalPrice: 210,
      currencyCode: 'USD',
      exchangeTotalPrice: 189.11,
      exchangeCurrencyCode: 'EUR',
    },
    {
      type: 'childCareSeat',
      option: 3,
    },
    {
      type: 'oneWayFee',
      totalPrice: 0,
      currencyCode: 'USD',
      exchangeTotalPrice: 0,
      exchangeCurrencyCode: 'EUR',
    },
    ...,
  ], 
}
```

#### example for type `'hotel'`

```
{
  type: BookingManagerConnector.DATA_TYPES.hotel,
  booking: {
    fromDate: '2017-09-20',
    toDate: '2017-09-27',
    editUrl: 'example://url-for.editing/?the=item',
    availabilityUrl: 'example://url-to-do.an/availability/check',
    price: 208,
    currencyCode: 'EUR',
  },
  hotel: {
    externalCode: 'MUC20S',
    category: 3,
    name: 'Hotel ibis Muenchen City Sued',
    imageUrl: 'example://url-to-hotel.img',
    address: 'Raintaler Str.47, 81539, Munich, DE',
    latitude: '48.139497',
    longitude: '11.563788',
  },
  room: {
    code: 'DZ',
    quantity: 2,
    occupancy: 3,
    mealCode: 'U',
  },
  travellers: [
    {
      type: 'male',
      firstName: 'john',
      lastName: 'doe',
      age: 32,
    },
    {
      type: 'child',
      age: 4,
    },
    {
      type: 'infant',
    },
    ...
  ],
  services: ['parking', 'spa_fitness', ...],
}
```

#### example for type `'roundtrip'`

```
{
  type: BookingManagerConnector.DATA_TYPES.roundTrip,
  booking: {
    id: 'E2784NQXTHEN',
    fromDate: '2017-12-05',
    toDate: '2017-12-16',
    price: 860,
    currencyCode: 'EUR',
  },
  trip: {
    destination: 'YYZ',
    alias: 'Die Küste Südkaliforniens (ab San Francisco)',
    imageUrl: 'example://url-to-round-trip.img',
  },
  route: [
    {
      type: 'accommodation',
      fromDate: '2018-05-03',
      toDate: '2018-05-05',
      location: 'Santa Maria',
      hotel: 'Travelodge Santa Maria',
      rooms: [
        {
          name: 'Double/Twin Room',
          quantity: 2,
        },
        {
          name: 'Princess Suite',
        },
        ...
      ],
      latitude: '48.139497',
      longitude: '11.563788',
    },
    {
        type: 'transfer',
        description: 'Transfer San Francisco Flughafen - San Francisco Hotel',
    },
    ...
  ],
  travellers: [
    {
      type: 'male',
      firstName: 'john',
      lastName: 'doe',
      age: 32,
    },
    {
      type: 'child',
      age: 4,
    },
    {
      type: 'infant',
    },
    ...
  ],
}
```

#### example for type `'camper'`

```
{
  type: BookingManagerConnector.DATA_TYPES.camper,
  rental: {
    status: 'OK',
    editUrl: 'example://url-for.editing/?the=item',
    availabilityUrl: 'example://url-to-do.an/availability/check',
    conditionUrl: 'example://url-to-the.conditions',
    price: 506,
    currencyCode: 'EUR',
    milesIncludedPerDay: 300,
    milesPackagesIncluded: 5,
  },
  vehicle: {
    code: 'FS',
    category: 'VAN',
    name: 'Deluxe Campervan',
    imageUrl: 'example://url-to-vehicle.img',
  },
  renter: {
    code: 'PRT02',
    name: 'Avis',
    logoUrl: 'example://url-to-renter.logo',
  },
  pickUp: {
    type: 'station',
    date: '2017-12-28', 
    time: '09:15', 
    locationCode: 'LIS1',
    name: 'Avis',
    address: '4332 Collins Avenue, Miami South Beach',
    phoneNumber: '(305) 532-8257',
    latitude: '25.8149316',
    longitude: '-80.1230047',
  },
  dropOff: {
    type: 'station',
    date: '2017-12-28', 
    locationCode: 'LIS2',
    name: 'Avis',
    address: '4332 Collins Avenue, Miami South Beach',
    phoneNumber: '(305) 532-8257',
    latitude: '37.6213129',
    longitude: '-122.3789554',
  },
  services: [
    'included service',
    '...',
  ],
  extras: [
    {
      name: 'Extra Name',
      code: 'ECX0001',
      amount: 3,
      totalPrice: 210,
      currencyCode: 'USD',
      exchangeTotalPrice: 189.11,
      exchangeCurrencyCode: 'EUR',
    },
    {
      name: 'Early Bird Special',
      code: 'USA740',
      amount: 1,
    },
    ...,
  ], 
  travellers: [
    {
      type: 'male',
      firstName: 'john',
      lastName: 'doe',
      age: 32,
    },
    {
      type: 'child',
      age: 4,
    },
    {
      type: 'infant',
    },
    ...
  ],
}
```


## Debugging

The connector provides some debugging output - either you set the connectionOption `debug` to `true` or 
you add the parameter "&debug" to your URL. You will see the debug output in the browser console.


### How to test ...

#### ... the code

Write a test and execute `npm run test` - the unit tests will tell you, if everything is fine.
Personal goal: Try to increase the test coverage to ~100%.

#### ... the connector

We prepared a [test file](tests/manual/index.html). Just execute `npm run serve` and use the provided URL.

#### ... your implementation

You can open your implementation in the [Staging-System](https://fti360-bm-staging.firebaseapp.com/#/ibe/external) 
of the BM and execute your tests.
