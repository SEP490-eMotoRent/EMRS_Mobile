import { useState } from 'react';

export interface IncidentFormData {
    incidentLocation: string;
    description: string;
    date: string;
    time: string;
    photos: string[]; // URIs instead of File[]
}

interface ValidationErrors {
    incidentLocation?: string;
    description?: string;
    date?: string;
    time?: string;
    photos?: string;
}

interface UseIncidentFormResult {
    formData: IncidentFormData;
    errors: ValidationErrors;
    setIncidentLocation: (value: string) => void;
    setDescription: (value: string) => void;
    setDate: (value: string) => void;
    setTime: (value: string) => void;
    addPhoto: (uri: string) => void;
    removePhoto: (index: number) => void;
    validate: () => boolean;
    reset: () => void;
    getIncidentDateTime: () => Date;
}

const getCurrentDateTime = () => {
    const now = new Date();
    return {
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        }).replace(/^0/, '').trim(), // "3:30 PM", not "03:30 PM"
    };
};

const initialFormData: IncidentFormData = {
    incidentLocation: '',
    description: '',
    ...getCurrentDateTime(),
    photos: [],
};

export const useIncidentForm = (): UseIncidentFormResult => {
    const [formData, setFormData] = useState<IncidentFormData>(initialFormData);
    const [errors, setErrors] = useState<ValidationErrors>({});

    const setIncidentLocation = (value: string) => {
        setFormData(prev => ({ ...prev, incidentLocation: value }));
        if (errors.incidentLocation) {
            setErrors(prev => ({ ...prev, incidentLocation: undefined }));
        }
    };

    const setDescription = (value: string) => {
        setFormData(prev => ({ ...prev, description: value }));
        if (errors.description) {
            setErrors(prev => ({ ...prev, description: undefined }));
        }
    };

    const setDate = (value: string) => {
        setFormData(prev => ({ ...prev, date: value }));
        if (errors.date) {
            setErrors(prev => ({ ...prev, date: undefined }));
        }
    };

    const setTime = (value: string) => {
        setFormData(prev => ({ ...prev, time: value }));
        if (errors.time) {
            setErrors(prev => ({ ...prev, time: undefined }));
        }
    };

    const addPhoto = (uri: string) => {
        if (formData.photos.length < 4) {
            setFormData(prev => ({ ...prev, photos: [...prev.photos, uri] }));
            if (errors.photos) {
                setErrors(prev => ({ ...prev, photos: undefined }));
            }
        }
    };

    const removePhoto = (index: number) => {
        setFormData(prev => ({
            ...prev,
            photos: prev.photos.filter((_, i) => i !== index),
        }));
    };

    const convertTo24Hour = (time12h: string): string | null => {
        if (!time12h || typeof time12h !== 'string') return null;

        // Match: "3:30 PM", "03:45 AM", "12:00 PM"
        const match = time12h.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return null;

        let [_, hoursStr, minutesStr, period] = match;
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        // Validate
        if (isNaN(hours) || isNaN(minutes)) return null;
        if (hours < 1 || hours > 12) return null;
        if (minutes < 0 || minutes > 59) return null;

        let hours24 = hours;
        if (hours === 12) hours24 = 0;
        if (period.toUpperCase() === 'PM') hours24 += 12;

        return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    };

    const getIncidentDateTime = (): Date | null => {
        try {
            // Validate date: YYYY-MM-DD
            if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
                return null;
            }

            const time24h = convertTo24Hour(formData.time);
            if (!time24h) return null;

            const isoString = `${formData.date}T${time24h}`;
            const date = new Date(isoString);

            // Android throws on invalid, iOS returns Invalid Date
            if (isNaN(date.getTime())) return null;

            // Extra: prevent rollover (Feb 30 → Mar 2)
            const [y, m, d] = formData.date.split('-').map(Number);
            if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
                return null;
            }

            return date;
        } catch (err) {
            console.error('Invalid date/time:', err);
            return null;
        }
    };

    const validate = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!formData.incidentLocation.trim()) {
            newErrors.incidentLocation = 'Incident location is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
            newErrors.date = 'Invalid date format';
        }

        if (!formData.time) {
            newErrors.time = 'Time is required';
        } else if (!convertTo24Hour(formData.time)) {
            newErrors.time = 'Invalid time format (use: 3:30 PM)';
        }

        const incidentDate = getIncidentDateTime();
        if (!incidentDate) {
            newErrors.date = 'Invalid date or time';
        } else if (incidentDate > new Date()) {
            newErrors.date = 'Incident date cannot be in the future';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const reset = () => {
        setFormData({
            ...initialFormData,
            ...getCurrentDateTime(),
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        setIncidentLocation,
        setDescription,
        setDate,
        setTime,
        addPhoto,
        removePhoto,
        validate,
        reset,
        getIncidentDateTime,
    };
};