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
- `'camper'`

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
    price: 506,
    currencyCode: 'EUR',
    editUrl: 'url://for.editting/?the=item',
    availabilityUrl: 'url://to-do.an/availability/check',
    conditionUrl: 'url://to-the.conditions',
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
    locationCode: 'MIA3',  /** 4LC **/
    station: {
      code: 'USA81',
      name: 'Meeting Point',
      address: '780 Mcdonnell Road, San Francisco Airport',
      phoneNumber: '(650) 616-2400',
      latitude: '37.6213129',
      longitude: '-122.3789554',
    },
    hotel: {
      name: 'Best Hotel',
      address: 'hotel street 1, 12345 hotel city',
      phoneNumber: '+49 172 678 0832 09',
    },
  },
  dropOff: {
    locationCode: 'SFO',  /** 4LC **/
    station: {
      code: 'USA81',
      name: 'Meeting Point',
      address: '780 Mcdonnell Road, San Francisco Airport',
      phoneNumber: '(650) 616-2400',
      latitude: '37.6213129',
      longitude: '-122.3789554',
    },
    hotel: {
      name: 'Best Hotel',
      address: 'hotel street 1, 12345 hotel city',
      phoneNumber: '+49 172 678 0832 09',
    },
  },
  services: {
    liability: {
      amount: 1000000,
      currencyCode: 'EUR',
    },
    includedMileage: {
      amount: Infinity,  /** means "unlimited" **/
    },
    firstAdditionalDriver: {
      amount: 2,
    },
    feeST: {
      amount: Infinity,
    },
    ...,
  },
  extras: {
    additionalDriver: {
      amount: 3,
      totalPrice: 210,
      currencyCode: 'USD',
      exchangeTotalPrice: 189.11,
      exchangeCurrencyCode: 'EUR',
    },
    oneWayFee: {
      amount: 1,
      totalPrice: 0,
      currencyCode: 'EUR',
    },
    childCareSeat3: {
      amount: 1,
    },
    ...,
  }, 
}
```

| type    | fields         | example
| :---    | :---           | :---
| hotel   | .roomCode      | 'DZ' 
|         | .mealCode      | 'U' 
|         | .roomQuantity  | '2'
|         | .roomOccupancy | '4'
|         | .destination   | 'LAX20S' 
|         | .dateFrom      | '20092017' 
|         | .dateTo        | '20092017' 
|         | .children      | [ { name: 'john', age: '11' }, ... ] 

| type      | fields              | example
| :---      | :---                | :---
| roundTrip | .bookingId          | 'NEZE2784NQXTHEN' 
|           | .destination        | 'YYZ' 
|           | .numberOfPassengers | '1' 
|           | .startDate          | '05122017' 
|           | .endDate            | '16122017'
|           | .title              | 'H'
|           | .name               | 'DOE/JOHN'
|           | .age                | '32'
|           | .birthday*          | '040485'

*In case "age" and "birthday" are set "birthday" is preferred.
 
| type     | fields                 | example
| :---     | :---                   | :---
| camper   | .renterCode            | 'PRT02' 
|          | .camperCode            | 'FS' 
|          | .pickUpLocation        | 'LIS1' 
|          | .pickUpDate            | '10102017' 
|          | .dropOffLocation       | 'LIS2' 
|          | .dropOffDate           | '17102017' 
|          | .milesIncludedPerDay   | '300' 
|          | .milesPackagesIncluded | '3' 
|          | .extras                | ['\<extraName\>.\<count\>', 'extra.2', 'special']


## Debugging

The connector provides some debugging output - either you set the connectionOption `debug` to `true` or 
you add the parameter "&debug" to your URL. You will see the debug output in the browser console.


### How to test ...

#### ... the code

Write a test and execute `npm run test` - the unit tests will tell you, if everything is fine.
Personal goal: Try to increase the test coverage to ~100%.

#### ... the connector

We prepared a test file, which can be opened in the Test-System of the BM.
Just execute `npm run serve` and use the provided URL.
