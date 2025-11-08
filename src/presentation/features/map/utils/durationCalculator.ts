export const calculateRentalDuration = (dateRangeStr: string): number => {
    // Default to 1 day if no date selected
    if (dateRangeStr === "Chọn Ngày" || !dateRangeStr || dateRangeStr.trim() === "") {
        console.log('📅 No date selected, defaulting to 1 day');
        return 1;
    }

    console.log('📅 Calculating duration for:', dateRangeStr);

    try {
        // Split by " - " separator
        const parts = dateRangeStr.split(" - ");
        if (parts.length !== 2) {
            console.warn("Invalid date range format:", dateRangeStr);
            return 1;
        }

        const [startStr, endStr] = parts;

        // Parse dates (handle both Vietnamese and English formats)
        const startDate = parseDate(startStr.trim());
        const endDate = parseDate(endStr.trim());

        console.log('📅 Parsed dates:', {
            startStr,
            endStr,
            startDate,
            endDate
        });

        if (!startDate || !endDate) {
            console.warn("Failed to parse dates:", { startStr, endStr });
            return 1;
        }

        // Calculate difference in milliseconds
        const diffMs = endDate.getTime() - startDate.getTime();
        
        // Convert to days (with fractional part for hours)
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        console.log('📅 Duration calculated:', {
            diffMs,
            diffDays: diffDays.toFixed(2),
            rounded: Math.max(Math.round(diffDays * 100) / 100, 0.04)
        });

        // Round to 2 decimal places (hours precision)
        return Math.max(Math.round(diffDays * 100) / 100, 0.04); // Minimum 1 hour (0.04 days)
    } catch (error) {
        console.error("Error calculating duration:", error);
        return 1;
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
        const dateOnly = parts[0]; // "Nov 30"
        const timeStr = parts[1]; // "6:00 PM" or undefined
        
        console.log('🗓️ parseEnglishDate - dateOnly:', dateOnly, 'timeStr:', timeStr);
        
        // Parse date using Date constructor
        let parsedDate = new Date(dateOnly + " " + new Date().getFullYear());
        
        console.log('🗓️ parseEnglishDate - initial parsed:', parsedDate);
        
        // Validate the parsed date
        if (isNaN(parsedDate.getTime())) {
            console.error('🗓️ Invalid date:', dateOnly);
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
                console.log('🗓️ parseEnglishDate - after time set:', parsedDate);
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

/**
 * Formats duration for display (e.g., "3 ngày", "1 ngày 5 giờ")
 */
export const formatDuration = (days: number): string => {
    const wholeDays = Math.floor(days);
    const hours = Math.round((days - wholeDays) * 24);

    if (wholeDays === 0) {
        return `${hours} giờ`;
    }
    
    if (hours === 0) {
        return `${wholeDays} ngày`;
    }
    
    return `${wholeDays} ngày ${hours} giờ`;
};