import { Event } from '@/types/event';

const EVENTS_URL = 'https://cdn.timeleft.com/frontend-tech-test/events.json';
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds timeout

/** 
 * Simple in-memory cache 
 * @description 
 * This cache stores the events for 5 minutes to avoid redundant API requests.
 * @type {Event[] | null}
 */
let cachedEvents: Event[] | null = null;
let lastFetchedTime = 0;
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // Cache expires after 5 minutes

export interface FetchEventsOptions {
    forceRefresh?: boolean;
}

/**
 * Fetches events from the remote CDN.
 * Uses an in-memory cache to prevent redundant fetches unless `forceRefresh` is true.
 */
export async function getEvents(options?: FetchEventsOptions): Promise<Event[]> {
    const { forceRefresh = false } = options || {};
    const now = Date.now();

    // Return cached events if they exist, are not expired, and a refresh is not forced
    if (cachedEvents && !forceRefresh && (now - lastFetchedTime < CACHE_EXPIRY_MS)) {
        return cachedEvents;
    }

    // Create an AbortController for request timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(EVENTS_URL, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
        }

        const data: Event[] = await response.json();

        // Cache the successful response
        cachedEvents = data;
        lastFetchedTime = now;

        return data;
    } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your internet connection.');
        }

        throw new Error(error.message || 'An error occurred while fetching events.');
    }
}
