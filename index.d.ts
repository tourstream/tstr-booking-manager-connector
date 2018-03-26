declare namespace bookingManagerConnector {
    export enum ServiceType {
        Car = "car",
        Hotel = "hotel",
        RoundTrip = "roundtrip",
        Camper = "camper",
    }
    export enum CarRentalStatus {
        Okay = "OK",
        OnRequest = "RQ",
    }
    export enum CarVehicleCategory {
        SmallCar = "SMALL_CAR",
        CompactCar = "COMPACT_CAR",
        MediumClass = "MEDIUM_CLASS",
        UpperClass = "UPPER_CLASS",
        Suv = "SUV",
        Minivan = "MINIVAN",
        Cabrio = "CABRIO",
        Special = "SPECIAL",
        Pickup = "PICKUP",
        Sport = "SPORT",
        Uncategorized = "UNCATEGORIZED",
        VariousCartypes = "VARIOUS_CARTYPES",
    }
    export enum CarLocationType {
        Hotel = "hotel",
        Station = "station",
    }
    export enum CarExtraType {
        AdditionalDriver = "additionalDriver",
        NavigationSystem = "navigationSystem",
        OneWayFee = "oneWayFee",
        ChildCareSeat = "childCareSeat",
    }
    export enum HotelRoomCode {
        SingleRoom = "EZ",
        DoubleRoom = "DZ",
        TripleRoom = "TZ",
        QuadrupleRoom = "VZ",
        TwinRoom = "DU",
        DoubleRoomForSingleUse = "D1",
    }
    export enum HotelMealCode {
        SelfCatering = "U",
        BedAndBreakfast = "F",
        HalfBoard = "H",
        FullBoard = "V",
        AllInclusive = "A",
    }
    export enum HotelServiceType {
        Parking = "parking",
        SpaFitness = "spa_fitness",
        Connection = "connection",
    }
    export enum TravellerType {
        Male = "male",
        Female = "female",
        Child = "child",
        Infant = "infant",
    }
    export enum RoundTripRouteType {
        Accommodation = "accommodation",
        Transfer = "transfer",
    }
    export enum CamperRentalStatus {
        Okay = "OK",
        OnRequest = "REQUESTED",
    }
    export enum CamperMilesAmount {
        Unlimited = "UNL",
    }
    export interface DataTypes {
        car: ServiceType.Car;
        hotel: ServiceType.Hotel;
        roundTrip: ServiceType.RoundTrip;
        camper: ServiceType.Camper;
    }
    export interface ConnectorOptions {
        debug: boolean;
        useDateFormat: string;
        useTimeFormat: string;
    }
    export interface Traveller {
        type: TravellerType;
        name: string;
        age: number | string;
    }
    export interface CarRental {
        status: CarRentalStatus | string;
        editUrl: string;
        availabilityUrl: string;
        conditionUrl: string;
        price: number | number;
        currencyCode: string;
    }
    export interface CarVehicle {
        code: string;
        category: CarVehicleCategory | string;
        name: string;
        imageUrl: string;
    }
    export interface CarRenter {
        code: string;
        name: string;
        logoUrl: string;
    }
    export interface VehicleLocation {
        type: CarLocationType;
        date: string;
        time: string;
        locationCode: string;
        name: string;
        address: string;
        phoneNumber: string;
        latitude: number | string;
        longitude: number | string;
    }
    export interface CarExtra {
        type: CarExtraType | string;
        amount: number | string;
        totalPrice: number | string;
        currencyCode: string;
        exchangeTotalPrice: number | string;
        exchangeCurrencyCode: string;
    }
    export interface CarData extends TransferData {
        type: ServiceType.Car;
        rental: CarRental;
        vehicle: CarVehicle;
        renter: CarRenter;
        pickUp: VehicleLocation;
        dropOff: VehicleLocation;
        services: Array<string>;
        extras: Array<CarExtra>;
    }
    export interface HotelBooking {
        fromDate: string;
        toDate: string;
        editUrl: string;
        availabilityUrl: string;
        price: number | string;
        currencyCode: string;
    }
    export interface HotelHotel {
        externalCode: string;
        category: number | string;
        name: string;
        imageUrl: string;
        address: string;
        latitude: number | string;
        longitude: number | string;
    }
    export interface HotelRoom {
        code: HotelRoomCode | string;
        quantity: number | string;
        occupancy: number | string;
        mealCode: HotelMealCode | string;
    }
    export interface HotelData extends TransferData {
        type: ServiceType.Hotel;
        booking: HotelBooking;
        hotel: HotelHotel;
        room: HotelRoom;
        travellers: Array<Traveller>;
        services: Array<HotelServiceType | string>;
    }
    export interface RoundTripBooking {
        id: string;
        fromDate: string;
        toDate: string;
        price: number | string;
        currencyCode: string;
    }
    export interface RoundTripTrip {
        destination: string;
        alias: string;
        imageUrl: string;
    }
    export interface RoundTripRouteRoom {
        name: string;
        quantity: number | string;
    }
    export interface RoundTripRoute {
        type: RoundTripRouteType | string;
        fromDate: string;
        toDate: string;
        location: string;
        hotel: string;
        rooms: Array<RoundTripRouteRoom>;
        latitude: number | string;
        longitude: number | string;
    }
    export interface RoundTripData extends TransferData {
        type: ServiceType.RoundTrip;
        booking: RoundTripBooking;
        trip: RoundTripTrip;
        route: Array<RoundTripRoute>;
        travellers: Array<Traveller>;
    }
    export interface CamperRental {
        status: CamperRentalStatus | string;
        editUrl: string;
        availabilityUrl: string;
        conditionUrl: string;
        price: number | string;
        currencyCode: string;
        milesIncludedPerDay: number | string;
        milesPackagesIncluded: number | string;
    }
    export interface CamperVehicle {
        code: string;
        category: string;
        name: string;
        imageUrl: string;
    }
    export interface CamperRenter {
        code: string;
        name: string;
        logoUrl: string;
    }
    export interface CamperExtra {
        name: string;
        code: string;
        amount: number | string | CamperMilesAmount.Unlimited;
        totalPrice: number | string;
        currencyCode: string;
        exchangeTotalPrice: number | string;
        exchangeCurrencyCode: string;
    }
    export interface CamperData extends TransferData {
        type: ServiceType.Camper;
        rental: CamperRental;
        vehicle: CamperVehicle;
        renter: CamperRenter;
        pickUp: VehicleLocation;
        dropOff: VehicleLocation;
        services: Array<string>;
        extras: Array<CamperExtra>;
    }
    export interface TransferData {
        _?: {
            version: string;
        };
    }
    export type BookingManagerData = CarData | HotelData | RoundTripData | CamperData;
    interface BookingManagerApi {
        addToBasket(transferData: TransferData): Promise<any>;
        directCheckout(transferData: TransferData): Promise<any>;
        done(): Promise<any>;
    }
    const DATA_TYPES: DataTypes;
    const DEFAULT_OPTIONS: ConnectorOptions;
    class BookingManagerConnector {
        constructor(options?: ConnectorOptions);
        connect(): Promise<any>;
        addToBasket(data: BookingManagerData): Promise<any>;
        directCheckout(data: BookingManagerData): Promise<any>;
        done(): Promise<any>;
    }
    export { DATA_TYPES, DEFAULT_OPTIONS, BookingManagerConnector as default };
}

export = bookingManagerConnector;