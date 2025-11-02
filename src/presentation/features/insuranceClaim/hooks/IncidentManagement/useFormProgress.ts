import { useMemo } from 'react';
import { IncidentFormData } from './useIncidentForm';

interface UseFormProgressResult {
    progress: number;
    completedFields: number;
    totalFields: number;
}

export const useFormProgress = (formData: IncidentFormData): UseFormProgressResult => {
    const progress = useMemo(() => {
        let completed = 0;
        const total = 5; // Total required fields

        // 1. Incident Location (20%)
        if (formData.incidentLocation.trim().length > 0) {
        completed += 1;
        }

        // 2. Description (20%)
        if (formData.description.trim().length >= 10) {
        completed += 1;
        }

        // 3. Date (20%)
        if (formData.date) {
        completed += 1;
        }

        // 4. Time (20%)
        if (formData.time) {
        completed += 1;
        }

        // 5. Photos (20%) - At least 1 photo recommended
        if (formData.photos.length > 0) {
        completed += 1;
        }

        // Calculate percentage
        const percentage = Math.round((completed / total) * 100);
        
        return {
        progress: percentage,
        completedFields: completed,
        totalFields: total,
        };
    }, [formData]);

    return progress;
};