declare namespace bookingManagerConnector {
    export const enum ServiceType {
        Car = "car",
        Hotel = "hotel",
        RoundTrip = "roundtrip",
        Camper = "camper",
    }
    export const enum CarRentalStatus {
        Okay = "OK",
        OnRequest = "RQ",
    }
    export const enum CarVehicleCategory {
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
    export const enum CarLocationType {
        Hotel = "hotel",
        Station = "station",
    }
    export const enum CarExtraType {
        AdditionalDriver = "additionalDriver",
        NavigationSystem = "navigationSystem",
        OneWayFee = "oneWayFee",
        ChildCareSeat = "childCareSeat",
    }
    export const enum HotelRoomCode {
        SingleRoom = "EZ",
        DoubleRoom = "DZ",
        TripleRoom = "TZ",
        QuadrupleRoom = "VZ",
        TwinRoom = "DU",
        DoubleRoomForSingleUse = "D1",
    }
    export const enum HotelMealCode {
        SelfCatering = "U",
        BedAndBreakfast = "F",
        HalfBoard = "H",
        FullBoard = "V",
        AllInclusive = "A",
    }
    export const enum HotelServiceType {
        Parking = "parking",
        SpaFitness = "spa_fitness",
        Connection = "connection",
    }
    export const enum TravellerType {
        Male = "male",
        Female = "female",
        Child = "child",
        Infant = "infant",
    }
    export const enum RoundTripRouteType {
        Accommodation = "accommodation",
        Transfer = "transfer",
    }
    export const enum CamperRentalStatus {
        Okay = "OK",
        OnRequest = "REQUESTED",
    }
    export const enum CamperMilesAmount {
        Unlimited = "UNL",
    }
    export const enum CamperExtraType {
        Equipment = "equipment",
        Special = "special",
        Insurance = "insurance",
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
        firstName: string;
        lastName: string;
        dateOfBirth: string;
    }
    export interface CarRental {
        status: CarRentalStatus | string;
        editUrl: string;
        availabilityUrl?: string;
        conditionUrl: string;
        price: number | number;
        currencyCode: string;
        pnr: string;
    }
    export interface CarVehicle {
        code: string;
        category: CarVehicleCategory | string;
        name: string;
        imageUrl: string;
        sipp: string;
    }
    export interface CarRenter {
        code: string;
        name: string;
        logoUrl: string;
    }
    export interface VehicleLocation {
        type: CarLocationType;
        date: string;
        time?: string;
        locationCode: string;
        name: string;
        address: string;
        phoneNumber?: string;
        latitude: number | string;
        longitude: number | string;
    }
    export interface CarExtra {
        type: CarExtraType | string;
        option?: string,
        amount?: number | string;
        totalPrice?: number | string;
        currencyCode?: string;
        exchangeTotalPrice?: number | string;
        exchangeCurrencyCode?: string;
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
        travellers: Array<Traveller>;
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
        category: number;
        name: string;
        imageUrl: string;
        address: string;
        latitude: number | string;
        longitude: number | string;
    }
    export interface HotelRoom {
        code: HotelRoomCode | string;
        quantity: number;
        occupancy: number;
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
    export interface RoundTripRouteAccommodation {
        type: RoundTripRouteType.Accommodation | string;
        fromDate: string;
        toDate: string;
        location: string;
        hotel: string;
        rooms: Array<RoundTripRouteRoom>;
        latitude: number | string;
        longitude: number | string;
    }
    export interface RoundTripRouteTransfer {
        type: RoundTripRouteType.Transfer | string;
        description: string
    }
    export interface RoundTripData extends TransferData {
        type: ServiceType.RoundTrip;
        booking: RoundTripBooking;
        trip: RoundTripTrip;
        route: Array<RoundTripRouteTransfer | RoundTripRouteAccommodation>;
        travellers: Array<Traveller>;
    }

    export interface CamperRental {
        status: CamperRentalStatus | string;
        editUrl: string;
        availabilityUrl?: string;
        conditionUrl?: string;
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
        type: CamperExtraType;
        code: string;
        amount?: number | string | CamperMilesAmount.Unlimited;
        totalPrice: number | string;
        currencyCode?: string;
        exchangeTotalPrice?: number | string;
        exchangeCurrencyCode?: string;
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
        travellers: Array<Traveller>;
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
