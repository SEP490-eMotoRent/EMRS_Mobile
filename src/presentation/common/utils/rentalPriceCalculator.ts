/**
 * Rental Price Calculator
 * Calculates rental duration and total price from date ranges
 */

export interface RentalDuration {
  totalDays: number;           // Full days
  totalHours: number;          // Total hours (including partial days)
  days: number;                // Whole days
  hours: number;               // Remaining hours
  displayText: string;         // "6 ngày 3 giờ"
}

export interface PriceCalculation {
  dailyRate: number;           // Price per day
  duration: RentalDuration;
  subtotal: number;            // Daily rate × days
  hourlyCharge: number;        // Additional hourly charges
  total: number;               // Final total
  displayText: string;         // "1,188,000₫"
}

/**
 * Parse date range string (supports both English and Vietnamese formats)
 * 
 * @example
 * // Vietnamese format
 * Input: "13 Thg 11 | 6:00 SA - 19 Thg 11 | 9:00 SA"
 * Output: { startDate: Date, endDate: Date }
 * 
 * @example
 * // English format
 * Input: "Nov 13 | 6:00 PM - Nov 19 | 9:00 AM"
 * Output: { startDate: Date, endDate: Date }
 */
export function parseDateRange(dateRange: string): { startDate: Date; endDate: Date } | null {
  if (!dateRange || dateRange === "Chọn Ngày") {
    return null;
  }

  try {
    // Split by dash to get start and end
    const parts = dateRange.split(' - ');
    if (parts.length !== 2) {
      console.warn('[parseDateRange] Invalid format:', dateRange);
      return null;
    }

    const startPart = parts[0].trim();
    const endPart = parts[1].trim();

    const startDate = parseDateTime(startPart);
    const endDate = parseDateTime(endPart);

    if (!startDate || !endDate) {
      return null;
    }

    return { startDate, endDate };
  } catch (error) {
    console.error('[parseDateRange] Error:', error);
    return null;
  }
}

/**
 * Parse single date-time string (supports both English and Vietnamese formats)
 * 
 * @example
 * Input: "13 Thg 11 | 6:00 SA" or "Nov 13 | 6:00 PM"
 * Output: Date object
 */
function parseDateTime(dateTimeStr: string): Date | null {
  try {
    // Try Vietnamese format first: "13 Thg 11 | 6:00 SA" or "13 Thg 11 | 6:00 CH"
    const vnResult = tryParseVietnameseFormat(dateTimeStr);
    if (vnResult) return vnResult;

    // Try English format: "Nov 13 | 6:00 PM" or "Nov 13 | 6:00 AM"
    const enResult = tryParseEnglishFormat(dateTimeStr);
    if (enResult) return enResult;

    console.warn('[parseDateTime] No format matched:', dateTimeStr);
    return null;
  } catch (error) {
    console.error('[parseDateTime] Error:', error);
    return null;
  }
}

/**
 * Try to parse Vietnamese format
 */
function tryParseVietnameseFormat(dateTimeStr: string): Date | null {
  // Format: "13 Thg 11 | 6:00 SA" or "13 Thg 11 | 6:00 CH"
  const regex = /(\d+)\s+Thg\s+(\d+)\s*\|\s*(\d+):(\d+)\s+(SA|CH)/i;
  const match = dateTimeStr.match(regex);

  if (!match) return null;

  const [, day, month, hourStr, minuteStr, period] = match;

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Convert to 24-hour format
  if (period.toUpperCase() === 'CH' && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === 'SA' && hour === 12) {
    hour = 0;
  }

  const year = new Date().getFullYear();
  return new Date(year, parseInt(month, 10) - 1, parseInt(day, 10), hour, minute, 0);
}

/**
 * Try to parse English format
 */
function tryParseEnglishFormat(dateTimeStr: string): Date | null {
  // Format: "Nov 13 | 6:00 PM" or "Nov 13 | 6:00 AM"
  const regex = /([A-Za-z]+)\s+(\d+)\s*\|\s*(\d+):(\d+)\s+(AM|PM)/i;
  const match = dateTimeStr.match(regex);

  if (!match) return null;

  const [, monthStr, day, hourStr, minuteStr, period] = match;

  // Month name to number mapping (handles both abbreviated and full names)
  const monthMap: Record<string, number> = {
    'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
    'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
    'january': 1, 'february': 2, 'march': 3, 'april': 4, 'june': 6,
    'july': 7, 'august': 8, 'september': 9, 'october': 10, 'november': 11, 'december': 12,
  };

  const month = monthMap[monthStr.toLowerCase()];
  if (!month) {
    console.warn('[tryParseEnglishFormat] Unknown month:', monthStr);
    return null;
  }

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Convert to 24-hour format
  if (period.toUpperCase() === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period.toUpperCase() === 'AM' && hour === 12) {
    hour = 0;
  }

  const year = new Date().getFullYear();
  return new Date(year, month - 1, parseInt(day, 10), hour, minute, 0);
}

/**
 * Calculate rental duration between two dates
 * 
 * @example
 * Start: Nov 13, 6:00 AM
 * End:   Nov 19, 9:00 AM
 * Result: 6 days, 3 hours
 */
export function calculateDuration(startDate: Date, endDate: Date): RentalDuration {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const wholeDays = Math.floor(diffDays);
  const remainingHours = Math.round((diffDays - wholeDays) * 24);

  let displayText = '';
  if (wholeDays > 0) {
    displayText += `${wholeDays} ngày`;
  }
  if (remainingHours > 0) {
    if (displayText) displayText += ' ';
    displayText += `${remainingHours} giờ`;
  }
  if (!displayText) {
    displayText = '< 1 giờ';
  }

  return {
    totalDays: diffDays,
    totalHours: diffHours,
    days: wholeDays,
    hours: remainingHours,
    displayText,
  };
}

/**
 * Calculate total rental price with optional hourly rate
 * 
 * @param dailyRate - Price per day (e.g., 180000)
 * @param duration - Rental duration
 * @param hourlyRate - Optional hourly rate (default: dailyRate / 24)
 * @param minimumCharge - Minimum rental duration in hours (default: 24)
 */
export function calculatePrice(
  dailyRate: number,
  duration: RentalDuration,
  hourlyRate?: number,
  minimumCharge: number = 24
): PriceCalculation {
  // If no hourly rate provided, calculate as 1/24 of daily rate
  const effectiveHourlyRate = hourlyRate ?? Math.ceil(dailyRate / 24);

  // Apply minimum charge (e.g., minimum 1 day)
  let totalHours = duration.totalHours;
  if (totalHours < minimumCharge) {
    totalHours = minimumCharge;
  }

  // Calculate charges
  const wholeDays = Math.floor(totalHours / 24);
  const remainingHours = Math.ceil(totalHours % 24);

  const subtotal = wholeDays * dailyRate;
  const hourlyCharge = remainingHours * effectiveHourlyRate;
  const total = subtotal + hourlyCharge;

  return {
    dailyRate,
    duration,
    subtotal,
    hourlyCharge,
    total,
    displayText: `${total.toLocaleString('vi-VN')}₫`,
  };
}

/**
 * Calculate rental price from date range string
 * 
 * @example
 * const result = calculateRentalPrice(
 *   "13 Thg 11 | 6:00 SA - 19 Thg 11 | 9:00 SA",
 *   180000
 * );
 * // result.total = 1,188,000 (6.125 days × 180,000)
 */
export function calculateRentalPrice(
  dateRange: string,
  dailyRate: number,
  hourlyRate?: number
): PriceCalculation | null {
  const dates = parseDateRange(dateRange);
  if (!dates) {
    return null;
  }

  const duration = calculateDuration(dates.startDate, dates.endDate);
  return calculatePrice(dailyRate, duration, hourlyRate);
}

/**
 * Format price calculation for display
 */
export function formatPriceBreakdown(calculation: PriceCalculation): string[] {
  const lines: string[] = [];

  if (calculation.duration.days > 0) {
    lines.push(
      `${calculation.duration.days} ngày × ${calculation.dailyRate.toLocaleString('vi-VN')}₫ = ${calculation.subtotal.toLocaleString('vi-VN')}₫`
    );
  }

  if (calculation.duration.hours > 0) {
    const hourlyRate = Math.ceil(calculation.dailyRate / 24);
    lines.push(
      `${calculation.duration.hours} giờ × ${hourlyRate.toLocaleString('vi-VN')}₫ = ${calculation.hourlyCharge.toLocaleString('vi-VN')}₫`
    );
  }

  lines.push(`Tổng: ${calculation.total.toLocaleString('vi-VN')}₫`);

  return lines;
}

/**
 * Helper function to format duration display
 */
export function formatDuration(duration: RentalDuration): string {
  return duration.displayText;
}

/**
 * Helper to check if date range is valid
 */
export function isValidDateRange(dateRange: string): boolean {
  if (!dateRange || dateRange === "Chọn Ngày") {
    return false;
  }

  const dates = parseDateRange(dateRange);
  if (!dates) {
    return false;
  }

  return dates.endDate > dates.startDate;
}

/**
 * Example usage and test cases
 */
export const PRICE_CALCULATOR_EXAMPLES = {
  // Vietnamese format
  vietnameseDateRange: "13 Thg 11 | 6:00 SA - 19 Thg 11 | 9:00 SA",
  
  // English format
  englishDateRange: "Nov 13 | 6:00 AM - Nov 19 | 9:00 AM",
  
  dailyRate: 180000,
  
  expectedDuration: {
    days: 6,
    hours: 3,
    displayText: "6 ngày 3 giờ",
  },
  
  expectedTotal: 1188000, // (6 days × 180,000) + (3 hours × 7,500)
};

/**
 * Get rental summary text
 */
export function getRentalSummary(
  dateRange: string,
  dailyRate: number
): string {
  const calculation = calculateRentalPrice(dateRange, dailyRate);
  
  if (!calculation) {
    return `${dailyRate.toLocaleString('vi-VN')}₫/ngày`;
  }

  return `${calculation.duration.displayText} • ${calculation.displayText}`;
}