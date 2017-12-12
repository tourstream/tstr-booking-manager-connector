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

The formats are according to [momentjs date format](https://momentjs.com/docs/#/displaying/).


## Interface

The connector provides several functions for the communication with the BM.
```
bmConnector.connect();                    // establish the connection to the BM
bmConnector.addToBasket(dataObject);      // add an item to the basket of the BM
bmConnector.directCheckout(dataObject);   // handover an item to the BM and triggers the transfer to the CRS
bmConnector.exit();                       // destroy the connection to the BM
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

Depending on the `type` the structure of the `dataObject` differs.


#### example for type `'car'`

```
{
  type: BookingManagerConnector.DATA_TYPES.car,
  rental: {
    date: '2017-12-28', 
    time: '09:15', 
    duration: 12960,  /** in minutes **/
    status: 'OK',
    editUrl: 'url://for.editting/?the=item',
    availabilityUrl: 'url://to-do.an/availability/check',
    conditionUrl: 'url://to-the.conditions',
    price: 506,
    currencyCode: 'EUR',
  },
  vehicle: {
    code: 'E2',
    category: 'SMALL_CAR',
    name: 'Chevrolet Spark 2-4T AU',
    imageUrl: 'url://to-vehicle.img',
  },
  renter: {
    name: 'Meeting Point',
    logoUrl: 'url://to-renter.logo',
  },
  pickUp: {
    location: {
      code: 'MIA3',  /** 4LC **/
      name: 'MIAMI SOUTH BEACH',
      address: '3900 NW 25TH STREET',
    },
    station: {
      code: 'USA83',
      name: 'Alamo',
      address: '4332 Collins Avenue, Miami South Beach',
      phoneNumber: '(305) 532-8257',
      latitude: '25.8149316',
      longitude: '-80.1230047',
    },
    hotel: {
      name: 'Best Hotel',
      address: 'hotel street 1, 12345 hotel city',
      phoneNumber: '+49 172 678 0832 09',
    },
  },
  dropOff: {
    location: {
      code: 'SFO',  /** 4LC **/
      name: 'SAN FRANCISCO AIRPORT',
      address: '780 MCDONNELL ROAD',
    },
    station: {
      code: 'USA81',
      name: 'Meeting Point',
      address: '780 Mcdonnell Road, San Francisco Airport',
      phoneNumber: '(650) 616-2400',
      latitude: '37.6213129',
      longitude: '-122.3789554',
    },
    hotel: {
      name: 'Very Best Hotel',
      address: 'hotel street 2, 6789 hotel town',
      phoneNumber: '+49 454 878 97943',
    },
  },
  services: [
    {
      type: 'liability',
      amount: 1000000,
      currencyCode: 'USD',
    },
    {
      type: 'includedMileage'
      amount: Infinity,  /** means "unlimited" **/
    },
    {
      type: 'firstAdditionalDriver'
      amount: 2,
    },
    { type: 'feeST' },
    ...,
  ],
  extras: [
    {
      type: 'additionalDriver'
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
      type: 'oneWayFee'
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
    from: '2017-09-20',
    to: '2017-09-27',
    editUrl: 'url://for.editting/?the=item',
    availabilityUrl: 'url://to-do.an/availability/check',
    price: 208,
    currencyCode: 'EUR',
  },
  hotel: {
    destination: 'MUC',
    class: 3,
    name: 'Hotel ibis Muenchen City Sued',
    imageUrl: 'url://to-vehicle.img',
    address: 'Raintaler Str.47, 81539, Munich, DE',
    latitude: '48.139497',
    longitude: '11.563788',
  },
  room: {
    code: 'DZ',
    quantity: 2,
    occupancy: 4,
    mealCode: 'U',
  },
  travellers: [
    {
      gender: 'male',  // 'male', 'female', 'child'
      name: 'john doe',
      birthDate: '1983-11-08',
    },
    ...
  ],
  services: ['<extraName>', 'parking', 'spa_fitness', ...],
}
```

#### example for type `'roundTrip'`

```
{
  type: BookingManagerConnector.DATA_TYPES.roundTrip,
  booking: {
    id: 'E2784NQXTHEN',
    from: '2017-12-05',
    to: '2017-12-16',
    editUrl: 'url://for.editting/?the=item',
    availabilityUrl: 'url://to-do.an/availability/check',
    price: 860,
    currencyCode: 'EUR',
  },
  trip: {
    destination: 'YYZ',
    alias: 'Die Küste Südkaliforniens (ab San Francisco)',
    imageUrl: 'url://to-vehicle.img',
  },
  route: [
    {
      type: 'accommodation',
      date: '2018-05-03',
      location: 'Santa Maria',
      latitude: '48.139497',
      longitude: '11.563788',
      description: 'Travelodge Santa Maria',
    },
    ...
  ],
  travellers: [
    {
      gender: 'male',  // 'male', 'female', 'child'
      name: 'john doe',
      birthDate: '1983-11-08',
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

We prepared a test file, which can be opened in the [Test-System](https://fti360-bm-testing.firebaseapp.com/#/ibe/external) of the BM.
Just execute `npm run serve` and use the provided URL.
