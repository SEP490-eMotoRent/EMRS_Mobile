import { useState } from 'react';

export interface IncidentFormData {
    incidentLocation: string;
    description: string;
    date: string;
    time: string;
    photos: File[];
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
    addPhoto: (file: File) => void;
    removePhoto: (index: number) => void;
    validate: () => boolean;
    reset: () => void;
    getIncidentDateTime: () => Date;
}

// Helper to get current date and time
const getCurrentDateTime = () => {
    const now = new Date();
    return {
        date: now.toISOString().split('T')[0], // YYYY-MM-DD
        time: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
        }),
    };
};

const initialFormData: IncidentFormData = {
    incidentLocation: '',
    description: '',
    ...getCurrentDateTime(), // Auto-fill with current date/time
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

    const addPhoto = (file: File) => {
        if (formData.photos.length < 4) {
        setFormData(prev => ({ ...prev, photos: [...prev.photos, file] }));
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

    const convertTo24Hour = (time12h: string): string => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        
        if (hours === '12') {
        hours = '00';
        }
        
        if (modifier?.toUpperCase() === 'PM') {
        hours = String(parseInt(hours, 10) + 12);
        }
        
        return `${hours.padStart(2, '0')}:${minutes}:00`;
    };

    const getIncidentDateTime = (): Date => {
        const time24h = convertTo24Hour(formData.time);
        return new Date(`${formData.date}T${time24h}`);
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
        }

        if (!formData.time) {
        newErrors.time = 'Time is required';
        }

        // Optional: Validate incident date is not in the future
        const incidentDate = getIncidentDateTime();
        if (incidentDate > new Date()) {
        newErrors.date = 'Incident date cannot be in the future';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const reset = () => {
        setFormData({
        ...initialFormData,
        ...getCurrentDateTime(), // Reset with fresh current date/time
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