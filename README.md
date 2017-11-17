# Booking Manager Connector

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
<script src="https://assets.gcloud.fti-group.com/tstr-booking-manager-connector/latest/bookingManagerConnector.js"></script>

<script>
  var bmConnector = new BookingManagerConnector.default(instanceOptions);
</script>
```


## Interface

To connect to the Booking Manager use:
```
bmConnector.connect();
```

When you are connected you can send data to the Booking Manager via:
```
bmConnector.addToBasket(data);
```

Or you can do a direct checkout via:
```
bmConnector.directCheckout(data);
```

The `data` object has the following structure:
```
{
    numberOfTravellers: string,
    services: Array<ServiceObject>,
    remark: string,
}
```

And also you can close the connection to the Booking Manager:
```
bmConnector.exit()
```

_note: every method returns a promise_


### Supported `instanceOptions`

You can check the default options with `BookingManagerConnector.DEFAULT_OPTIONS`.

name          | default value  
:---          | :---           
debug         | false
useDateFormat | 'DDMMYYYY' (according to [momentjs date format](https://momentjs.com/docs/#/displaying/))
useTimeFormat | 'HHmm' (according to [momentjs date format](https://momentjs.com/docs/#/displaying/))


### `ServiceObject` structure

Depending on the `.type` the structure of the ServiceObject differs.


#### Supported service types

You can check the currently supported service types with `BookingManagerConnector.SERVICE_TYPES`:

- `'car'`
- `'hotel'`
- `'roundtrip'`
- `'camper'`

| type  | fields                   | example
| :---  | :---                     | :---
| car   | .vehicleTypeCode         | 'E4' 
|       | .rentalCode              | 'DEU85' 
|       | .pickUpLocation          | 'BER3' 
|       | .pickUpDate              | '28122017' 
|       | .pickUpTime              | '0915' 
|       | .dropOffLocation         | 'MUC' 
|       | .durationInMinutes       | '12960'
|       | .pickUpHotelName         | 'Best Hotel' 
|       | .pickUpHotelAddress      | 'hotel street 1, 12345 hotel city' 
|       | .pickUpHotelPhoneNumber  | '+49 172 678 0832 09' 
|       | .dropOffHotelName        | 'Very Best Hotel' 
|       | .dropOffHotelAddress     | 'hotel drive 34a, famous place' 
|       | .dropOffHotelPhoneNumber | '04031989213' 
|       | .extras                  | ['\<extraName\>.\<count\>', 'navigationSystem', 'childCareSeat0', 'childCareSeat3'] 

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

Sadly the debugging in some cases is not possible but the connector nevertheless provides some debugging output - 
either you set the connector option `.debug` to `true` or you add the parameter "debug" to your URL.
It will open an extra window for debug outputs.


### How to test ...

#### ... the code

Write a test and execute `npm run test` - the unit tests will tell you, if everything is fine. 
Personal goal: Try to increase the test coverage to ~100%.


## You have questions or problems with the implementation?

Check the [FAQs](FAQ.md) first!
