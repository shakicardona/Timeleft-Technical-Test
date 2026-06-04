
export type EventStatus = 'past' | 'upcoming' | 'live';

export type EventType = 'coffee' | 'dinner' | 'brunch' | 'food';

export interface Country {
    readonly id: number;
    readonly name: string;
}

export interface City {
    readonly id: number;
    readonly name: string;
    readonly country: Country;
}

export interface Zone {
    readonly id: number;
    readonly name: string;
    readonly city: City;
}

export interface Event {
    readonly id: number;
    readonly type: EventType;
    readonly date: string;
    readonly zone: Zone;
    readonly booked: number;
    readonly capacity: number;
    readonly status: EventStatus;
}
