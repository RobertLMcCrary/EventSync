interface Location {
    latitude: number;
    longitude: number;
}

interface Event {
    title: string;
    datetime_utc: string;
    venue: Venue;
    url: string;
    stats: Stats;
    type: string;
}

interface Venue {
    name: string;
    address: string;
}

interface Stats {
    highest_price: number | null;
    lowest_price: number | null;
}

interface ResponseData {
    events: Event[];
}

async function getUpcomingEventsHandler(location: Location, interests: string[]): Promise<Event[]> {
    const endpoint = "https://api.seatgeek.com/2/events";
    const clientId = process.env.SEATGEEK_CLIENT_ID || "";
    const queryParams = new URLSearchParams({
        client_id: clientId,
        lat: location.latitude.toString(),
        lon: location.longitude.toString(),
        per_page: '10'
    });
    if (interests && interests.length > 0) {
        queryParams.set("q", interests.join(" "));
    }
    const url = `${endpoint}?${queryParams.toString()}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ResponseData = await response.json();
        return data.events.map(event => ({
            title: event.title,
            datetime_utc: event.datetime_utc,
            venue: {
                name: event.venue.name,
                address: event.venue.address
            },
            url: event.url,
            stats: {
                highest_price: event.stats ? event.stats.highest_price : null,
                lowest_price: event.stats ? event.stats.lowest_price : null
            },
            type: event.type
        }));
    } catch (error) {
        throw error;
    }
}

export async function getUpcomingEvents(location: Location, interests: string[]): Promise<Event[] | Error> {
    try {
        return await getUpcomingEventsHandler(location, interests);
    } catch (error) {
        return new Error("An error occurred while fetching upcoming events.");
    }
}