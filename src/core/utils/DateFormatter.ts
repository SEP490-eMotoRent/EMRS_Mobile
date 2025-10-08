import { format, parse, parseISO } from 'date-fns';

export class DateFormatter {
    static formatDate(date: Date): string {
        return format(date, 'yyyy-MM-dd');
    }

    static formatTime(date: Date): string {
        return format(date, 'HH:mm');
    }

    static formatDateTime(date: Date): string {
        return format(date, 'yyyy-MM-dd HH:mm');
    }

    static parseDate(dateStr: string): Date | null {
        try {
        return parse(dateStr, 'yyyy-MM-dd', new Date());
        } catch (e) {
        return null;
        }
    }

    static parseTime(timeStr: string): Date | null {
        try {
        const parsed = parse(timeStr, 'HH:mm', new Date());
        return new Date(1970, 0, 1, parsed.getHours(), parsed.getMinutes());
        } catch (e) {
        return null;
        }
    }

    static parseDateTime(dateTimeStr: string): Date | null {
        try {
        return parseISO(dateTimeStr);
        } catch (e) {
        return null;
        }
    }
}