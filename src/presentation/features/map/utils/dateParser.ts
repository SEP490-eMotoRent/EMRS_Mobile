export interface DateRange {
    startTime?: string;
    endTime?: string;
}

export const parseDateRange = (dateRangeStr: string): DateRange => {
    // No date selected
    if (dateRangeStr === "Chọn Ngày" || !dateRangeStr || dateRangeStr.trim() === "") {
        return {};
    }

    try {
        // Split by " - " separator
        const parts = dateRangeStr.split(" - ");
        if (parts.length !== 2) {
            console.warn("Invalid date range format:", dateRangeStr);
            return {};
        }

        const [startStr, endStr] = parts;

        // Parse dates (handle both Vietnamese DD/MM and English "Dec 1 | 6:00 PM" formats)
        const startDate = parseDate(startStr.trim());
        const endDate = parseDate(endStr.trim());

        if (!startDate || !endDate) {
            console.warn("Failed to parse dates:", { startStr, endStr });
            return {};
        }

        // Set start time to 00:00:00 and end time to 23:59:59
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        return {
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
        };
    } catch (error) {
        console.error("Error parsing date range:", error);
        return {};
    }
};

/**
 * Parses date in multiple formats:
 * - Vietnamese: DD/MM or DD/MM/YYYY
 * - English: "Dec 1 | 6:00 PM" or "Dec 1"
 */
const parseDate = (dateStr: string): Date | null => {
    // Try Vietnamese format first (DD/MM or DD/MM/YYYY)
    if (dateStr.includes("/")) {
        return parseVietnameseDate(dateStr);
    }
    
    // Try English format (e.g., "Dec 1 | 6:00 PM" or "Dec 1")
    if (dateStr.match(/^[A-Za-z]{3}\s+\d+/)) {
        return parseEnglishDate(dateStr);
    }
    
    return null;
};

/**
 * Parses Vietnamese date format (DD/MM or DD/MM/YYYY)
 */
const parseVietnameseDate = (dateStr: string): Date | null => {
    const parts = dateStr.split("/");
    
    if (parts.length === 2) {
        // Format: DD/MM (assume current year)
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = new Date().getFullYear();
        
        if (isNaN(day) || isNaN(month)) return null;
        return new Date(year, month, day);
    } else if (parts.length === 3) {
        // Format: DD/MM/YYYY
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        return new Date(year, month, day);
    }
    
    return null;
};

/**
 * Parses English date format with time (e.g., "Dec 1 | 6:00 PM" or "Dec 1")
 */
const parseEnglishDate = (dateStr: string): Date | null => {
    try {
        // Split by "|" to separate date and time
        const parts = dateStr.split("|").map(p => p.trim());
        const dateOnly = parts[0]; // "Dec 1"
        const timeStr = parts[1]; // "6:00 PM" or undefined
        
        // Parse date using Date constructor (e.g., "Dec 1" or "Dec 1 2024")
        const parsedDate = new Date(dateOnly);
        
        // If year is not provided, assume current year
        if (dateOnly.split(" ").length === 2) {
            parsedDate.setFullYear(new Date().getFullYear());
        }
        
        // Validate the parsed date
        if (isNaN(parsedDate.getTime())) {
            return null;
        }
        
        // Parse time if provided (e.g., "6:00 PM")
        if (timeStr) {
            const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (timeMatch) {
                let hours = parseInt(timeMatch[1], 10);
                const minutes = parseInt(timeMatch[2], 10);
                const period = timeMatch[3].toUpperCase();
                
                // Convert to 24-hour format
                if (period === "PM" && hours !== 12) {
                    hours += 12;
                } else if (period === "AM" && hours === 12) {
                    hours = 0;
                }
                
                parsedDate.setHours(hours, minutes, 0, 0);
            }
        } else {
            // No time provided, set to midnight
            parsedDate.setHours(0, 0, 0, 0);
        }
        
        return parsedDate;
    } catch (error) {
        console.error("Error parsing English date:", error);
        return null;
    }
};