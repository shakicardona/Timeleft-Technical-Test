/**
 * Formats an ISO 8601 date string into a user-friendly format: "Tuesday, Dec 30 • 4:30 PM".
 * Adjusts automatically to the device's locale and timezone.
 */
export function formatEventDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        const formatter = new Intl.DateTimeFormat(undefined, {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        // Formatting outputs something like "Tuesday, Dec 30, 4:30 PM"
        const parts = formatter.format(date).split(', ');
        if (parts.length >= 3) {
            return `${parts[0]}, ${parts[1]} • ${parts[2]}`;
        }
        return formatter.format(date);
    } catch (error) {
        return dateString;
    }
}

export type AvailabilityStatus = 'sold-out' | 'filling-fast' | 'available';

export interface AvailabilityInfo {
    status: AvailabilityStatus;
    label: string;
    percentage: number;
    remaining: number;
    color: string;
}

/**
 * Computes booking progress and generates semantic UI badges based on occupancy.
 */
export function getEventAvailability(booked: number, capacity: number): AvailabilityInfo {
    const safeBooked = Math.max(0, booked);
    const safeCapacity = Math.max(1, capacity); // Avoid division by zero
    const percentage = Math.min(100, Math.round((safeBooked / safeCapacity) * 100));
    const remaining = Math.max(0, safeCapacity - safeBooked);

    if (safeBooked >= safeCapacity) {
        return {
            status: 'sold-out',
            label: 'Sold Out',
            percentage,
            remaining,
            color: '#E53E3E', // Red
        };
    }

    // 80% or more is considered "Filling Fast"
    if (percentage >= 80) {
        return {
            status: 'filling-fast',
            label: 'Filling Fast',
            percentage,
            remaining,
            color: '#DD6B20', // Orange
        };
    }

    return {
        status: 'available',
        label: `${remaining} seats left`,
        percentage,
        remaining,
        color: '#38A169', // Green
    };
}
