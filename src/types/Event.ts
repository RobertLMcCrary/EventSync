export interface PublicEvent {
    title: string;
    datetime_utc: string;
    venue: Venue;
    url: string;
    stats: Stats;
    type: string;
}

export interface Venue {
    name: string;
    address: string;
}

export interface Stats {
    highest_price: number | null;
    lowest_price: number | null;
}