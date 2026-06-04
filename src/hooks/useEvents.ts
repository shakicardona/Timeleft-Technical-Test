import { getEvents } from '@/api/eventsApi';
import { Event, EventStatus, EventType } from '@/types/event';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type SortOption = 'date-asc' | 'date-desc' | 'popularity' | 'seats-left';

export function useEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter & Sort States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedStatuses, setSelectedStatuses] = useState<EventStatus[]>(['upcoming', 'live']);
    const [selectedType, setSelectedType] = useState<EventType | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>('date-asc');

    const fetchEvents = useCallback(async (force = false) => {
        if (force) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const data = await getEvents({ forceRefresh: force });
            setEvents(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load events.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleRefresh = useCallback(() => {
        fetchEvents(true);
    }, [fetchEvents]);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        setSelectedCity(null);
        setSelectedStatuses(['upcoming', 'live']);
        setSelectedType(null);
        setSortBy('date-asc');
    }, []);

    const uniqueCities = useMemo(() => {
        const cities = events.map(e => e.zone.city.name);
        return Array.from(new Set(cities)).sort();
    }, [events]);

    const uniqueTypes = useMemo(() => {
        const types = events.map(e => e.type);
        return Array.from(new Set(types)).sort();
    }, [events]);

    const globalStats = useMemo(() => {
        const stats = { total: events.length, upcoming: 0, live: 0, past: 0 };
        events.forEach(e => {
            if (e.status === 'upcoming') stats.upcoming++;
            else if (e.status === 'live') stats.live++;
            else if (e.status === 'past') stats.past++;
        });
        return stats;
    }, [events]);



    // Filter & Sort list 
    const filteredAndSortedEvents = useMemo(() => {
        let result = [...events];

        // Filter by City
        if (selectedCity) {
            result = result.filter(e => e.zone.city.name.toLowerCase() === selectedCity.toLowerCase());
        }

        // Filter by Status
        if (selectedStatuses.length > 0) {
            result = result.filter(e => selectedStatuses.includes(e.status));
        }

        // Filter by Type
        if (selectedType) {
            result = result.filter(e => e.type.toLowerCase() === selectedType.toLowerCase());
        }

        // Search Query (Zone, City, Country, or Type)
        if (searchQuery.trim().length > 0) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(e =>
                e.zone.name.toLowerCase().includes(query) ||
                e.zone.city.name.toLowerCase().includes(query) ||
                e.zone.city.country.name.toLowerCase().includes(query) ||
                e.type.toLowerCase().includes(query)
            );
        }

        // --- SORTING ---
        result.sort((a, b) => {
            switch (sortBy) {
                case 'date-asc':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'date-desc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'popularity': {
                    // Compare percentage of capacity filled: booked / capacity
                    const popA = a.booked / a.capacity;
                    const popB = b.booked / b.capacity;
                    return popB - popA; // Descending (most popular first)
                }
                case 'seats-left': {
                    // Compare available capacity: capacity - booked
                    const leftA = a.capacity - a.booked;
                    const leftB = b.capacity - b.booked;
                    return leftB - leftA; // Descending (most seats left first)
                }
                default:
                    return 0;
            }
        });

        return result;
    }, [events, searchQuery, selectedCity, selectedStatuses, selectedType, sortBy]);

    const filteredStats = useMemo(() => {
        const stats = { total: filteredAndSortedEvents.length, upcoming: 0, live: 0, past: 0 };
        filteredAndSortedEvents.forEach(e => {
            if (e.status === 'upcoming') stats.upcoming++;
            else if (e.status === 'live') stats.live++;
            else if (e.status === 'past') stats.past++;
        });
        return stats;
    }, [filteredAndSortedEvents]);

    return {
        events: filteredAndSortedEvents,
        rawEvents: events,
        isLoading,
        isRefreshing,
        error,
        refresh: handleRefresh,

        // Dynamic Filter lists
        uniqueCities,
        uniqueTypes,
        globalStats,
        filteredStats,

        // Filter & Sort state & controllers
        searchQuery,
        setSearchQuery,
        selectedCity,
        setSelectedCity,
        selectedStatuses,
        setSelectedStatuses,
        selectedType,
        setSelectedType,
        sortBy,
        setSortBy,
        resetFilters,
    };
}
