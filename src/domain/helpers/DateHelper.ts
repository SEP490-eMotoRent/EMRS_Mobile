export class DateHelper {
    /**
     * Get default date range:
     * - Start: 3 days from now at 10:00 AM
     * - End: 7 days after start (10 days total from now) at 10:00 AM
     * This gives a 7-day rental period starting 3 days from today
     */
    static getDefaultDateRange(): string {
        const now = new Date();
        
        // Start date: 3 days from now
        const startDate = new Date(now);
        startDate.setDate(now.getDate() + 3);
        
        // End date: 7 days after start (10 days from now)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);

        const formatDate = (date: Date) => {
            const months = ["Thg 1", "Thg 2", "Thg 3", "Thg 4", "Thg 5", "Thg 6", 
                          "Thg 7", "Thg 8", "Thg 9", "Thg 10", "Thg 11", "Thg 12"];
            return `${date.getDate()} ${months[date.getMonth()]}`;
        };

        return `${formatDate(startDate)} | 10:00 SA - ${formatDate(endDate)} | 10:00 SA`;
    }

    /**
     * Get default date range in English format (for navigation params)
     */
    static getDefaultDateRangeEnglish(): string {
        const now = new Date();
        
        const startDate = new Date(now);
        startDate.setDate(now.getDate() + 3);
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);

        const formatDate = (date: Date) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${months[date.getMonth()]} ${date.getDate()}`;
        };

        return `${formatDate(startDate)} | 10:00 AM - ${formatDate(endDate)} | 10:00 AM`;
    }

    /**
     * Parse Vietnamese date range to ISO format for booking flow
     * Input: "26 Thg 11 | 10:00 SA - 25 Thg 11 | 10:00 SA"
     * Output: "2024-11-26 - 2025-11-25 (10:00 SA - 10:00 SA)"
     * 
     * ✅ Handles year rollover intelligently
     */
    static parseVietnameseDateRangeToISO(vietnameseDateRange: string): string {
        const monthMap: Record<string, number> = {
            'Thg 1': 0, 'Thg 2': 1, 'Thg 3': 2, 'Thg 4': 3,
            'Thg 5': 4, 'Thg 6': 5, 'Thg 7': 6, 'Thg 8': 7,
            'Thg 9': 8, 'Thg 10': 9, 'Thg 11': 10, 'Thg 12': 11,
        };

        // Parse pattern: "26 Thg 11 | 10:00 SA - 25 Thg 11 | 10:00 SA"
        const pattern = /(\d+)\s+(Thg\s+\d+)\s*\|\s*(\d+:\d+\s+(?:SA|CH))\s*-\s*(\d+)\s+(Thg\s+\d+)\s*\|\s*(\d+:\d+\s+(?:SA|CH))/;
        const match = vietnameseDateRange.match(pattern);

        if (!match) {
            console.warn('❌ Failed to parse Vietnamese date range:', vietnameseDateRange);
            return this.getDefaultDateRangeForBooking();
        }

        const [, startDay, startMonth, startTime, endDay, endMonth, endTime] = match;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();
        
        const startMonthNum = monthMap[startMonth];
        const endMonthNum = monthMap[endMonth];
        const startDayNum = parseInt(startDay);
        const endDayNum = parseInt(endDay);

        // ✅ SMART YEAR DETECTION
        let startYear = currentYear;
        let endYear = currentYear;

        // If start month is in the past, it must be next year
        if (startMonthNum < currentMonth) {
            startYear = currentYear + 1;
        } 
        // If same month but day has passed, next year
        else if (startMonthNum === currentMonth && startDayNum < currentDay) {
            startYear = currentYear + 1;
        }

        // Create start date
        const startDate = new Date(startYear, startMonthNum, startDayNum);
        
        // Determine end year based on relationship to start date
        endYear = startYear;
        let endDate = new Date(endYear, endMonthNum, endDayNum);

        // ✅ If end is before or equal to start, end must be next year
        if (endDate <= startDate) {
            endYear = startYear + 1;
            endDate = new Date(endYear, endMonthNum, endDayNum);
        }

        const formatISO = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const result = `${formatISO(startDate)} - ${formatISO(endDate)} (${startTime} - ${endTime})`;
        console.log('✅ Parsed Vietnamese date:', {
            input: vietnameseDateRange,
            output: result,
            startDate: formatISO(startDate),
            endDate: formatISO(endDate),
            durationDays: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        });
        
        return result;
    }

    /**
     * Get default date range in booking flow format
     * Output: "2024-11-28 - 2024-12-05 (10:00 SA - 10:00 SA)"
     */
    static getDefaultDateRangeForBooking(): string {
        const now = new Date();
        
        const startDate = new Date(now);
        startDate.setDate(now.getDate() + 3);
        
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);

        const formatISO = (date: Date): string => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return `${formatISO(startDate)} - ${formatISO(endDate)} (10:00 SA - 10:00 SA)`;
    }
}