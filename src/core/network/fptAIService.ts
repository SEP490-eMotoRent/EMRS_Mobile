const FPT_API_KEY = 'JKMYZzL8SSY6CTzk0OvDgM7Aaw5rUYYd';
// const FPT_API_KEY = 'bG5ABOoWAYiqWaYZU2CIyCm0Q8NDg0Kr';
const CITIZEN_ID_URL = 'https://api.fpt.ai/vision/idr/vnm';
const DRIVER_LICENSE_URL = 'https://api.fpt.ai/vision/dlr/vnm';

// ===== TYPES =====

export interface CitizenIDData {
    id: string;                    // ID number
    id_prob: string;
    name: string;                  // Full name
    name_prob: string;
    dob: string;                   // Date of birth
    dob_prob: string;
    sex: string;                   // Gender
    sex_prob: string;
    nationality: string;
    nationality_prob: string;
    home: string;                  // Address
    home_prob: string;
    address: string;               // Permanent address
    address_prob: string;
    doe: string;                   // Expiry date
    doe_prob: string;
    type: string;                  // Document type
    type_new?: string;             // For new ID cards
}

export interface CitizenIDBackData {
    religion_prob: string;
    religion: string;
    ethnicity_prob: string;
    ethnicity: string;
    features: string;              // Personal marks
    features_prob: string;
    issue_date: string;            // Issue date (ONLY on back side!)
    issue_date_prob: string;
    issue_loc_prob: string;
    issue_loc: string;             // Issue location (ONLY on back side!)
    type: string;
}

export interface DriverLicenseData {
    id: string;                    // License number
    id_prob: string;
    name: string;
    name_prob: string;
    dob: string;                   // Date of birth
    dob_prob: string;
    nation: string;                // Nationality
    nation_prob: string;
    address: string;
    address_prob: string;
    place_issue: string;           // Place of issue
    place_issue_prob: string;
    date: string;                  // Issue date
    date_prob: string;
    doe: string;                   // Expiry date
    doe_prob: string;
    class?: string | string[];     // License class(es)
    class_prob?: string | string[];
    code?: string;                 // Code (old type only)
    code_prob?: string;
    type: string;                  // Document type
}

export interface FPTAIResponse<T> {
    errorCode: number;
    errorMessage: string;
    data: T[];
}

// ===== HELPER FUNCTIONS =====

/**
 * Convert local image URI to FormData for FPT AI API
 */
const createImageFormData = (imageUri: string): FormData => {
    const formData = new FormData();
    
    // Extract filename from URI or use default
    const filename = imageUri.split('/').pop() || 'image.jpg';
    
    // Determine mime type
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('image', {
        uri: imageUri,
        name: filename,
        type: type,
    } as any);
    
    return formData;
};

/**
 * Parse date from FPT AI format (DD/MM/YYYY) to ISO format (YYYY-MM-DD)
 */
export const parseFPTDate = (dateStr: string): string | undefined => {
    if (!dateStr || dateStr === 'N/A') return undefined;
    
    // Try DD/MM/YYYY format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return undefined;
};

/**
 * Format date to DD/MM/YYYY for display
 */
export const formatDisplayDate = (isoDate: string): string => {
    if (!isoDate) return '';
    
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

// ===== API FUNCTIONS =====

/**
 * Recognize Vietnamese Citizen ID card (single side)
 */
export const recognizeCitizenID = async (
    imageUri: string
): Promise<CitizenIDData | CitizenIDBackData | null> => {
    try {
        const formData = createImageFormData(imageUri);
        
        const response = await fetch(CITIZEN_ID_URL, {
            method: 'POST',
            headers: {
                'api-key': FPT_API_KEY,
            },
            body: formData,
        });
        
        const result: FPTAIResponse<CitizenIDData | CitizenIDBackData> = await response.json();
        
        if (result.errorCode !== 0) {
            console.error('FPT AI Citizen ID Error:', result.errorMessage);
            throw new Error(result.errorMessage || 'Failed to recognize Citizen ID');
        }
        
        if (result.data && result.data.length > 0) {
            return result.data[0];
        }
        
        return null;
    } catch (error) {
        console.error('Citizen ID recognition failed:', error);
        throw error;
    }
};

/**
 * Recognize Vietnamese Driver's License
 */
export const recognizeDriverLicense = async (
    imageUri: string
): Promise<DriverLicenseData | null> => {
    try {
        const formData = createImageFormData(imageUri);
        
        const response = await fetch(DRIVER_LICENSE_URL, {
            method: 'POST',
            headers: {
                'api-key': FPT_API_KEY,
            },
            body: formData,
        });
        
        const result: FPTAIResponse<DriverLicenseData> = await response.json();
        
        if (result.errorCode !== 0) {
            console.error('FPT AI Driver License Error:', result.errorMessage);
            throw new Error(result.errorMessage || 'Failed to recognize Driver License');
        }
        
        if (result.data && result.data.length > 0) {
            return result.data[0];
        }
        
        return null;
    } catch (error) {
        console.error('Driver License recognition failed:', error);
        throw error;
    }
};

/**
 * Process both front and back images for Driver's License
 * Combines data from both sides
 */
export const recognizeDriverLicenseBothSides = async (
    frontImageUri: string,
    backImageUri: string
): Promise<{
    id: string;
    name: string;
    dob: string;
    address: string;
    issueDate: string;
    expiryDate: string;
    authority: string;
    class: string;
}> => {
    const [frontData, backData] = await Promise.all([
        recognizeDriverLicense(frontImageUri),
        recognizeDriverLicense(backImageUri),
    ]);
    
    if (!frontData) {
        throw new Error('Could not extract data from front image');
    }
    
    // Combine data (front side has most info)
    const licenseClass = frontData.class 
        ? (Array.isArray(frontData.class) ? frontData.class.join(', ') : frontData.class)
        : (backData?.class 
            ? (Array.isArray(backData.class) ? backData.class.join(', ') : backData.class)
            : '');
    
    return {
        id: frontData.id !== 'N/A' ? frontData.id : '',
        name: frontData.name !== 'N/A' ? frontData.name : '',
        dob: parseFPTDate(frontData.dob) || '',
        address: frontData.address !== 'N/A' ? frontData.address : '',
        issueDate: parseFPTDate(frontData.date) || '',
        expiryDate: parseFPTDate(frontData.doe) || '',
        authority: frontData.place_issue !== 'N/A' ? frontData.place_issue : '',
        class: licenseClass,
    };
};

/**
 * Process Citizen ID - REQUIRES BOTH FRONT AND BACK
 * Front: id, name, dob, address, expiry date (doe)
 * Back: issue_date, issue_loc (authority)
 */
export const recognizeCitizenIDBothSides = async (
    frontImageUri: string,
    backImageUri: string
): Promise<{
    id: string;
    name: string;
    dob: string;
    address: string;
    issueDate: string;
    expiryDate: string;
    authority: string;
}> => {
    const [frontResult, backResult] = await Promise.all([
        recognizeCitizenID(frontImageUri),
        recognizeCitizenID(backImageUri),
    ]);
    
    if (!frontResult) {
        throw new Error('Could not extract data from front side of ID card');
    }
    
    if (!backResult) {
        throw new Error('Could not extract data from back side of ID card');
    }
    
    // Type guard to check if result is front side data
    const isFrontData = (data: any): data is CitizenIDData => {
        return 'id' in data && 'name' in data;
    };
    
    // Type guard to check if result is back side data
    const isBackData = (data: any): data is CitizenIDBackData => {
        return 'issue_date' in data && 'issue_loc' in data;
    };
    
    // Determine which is front and which is back
    let frontData: CitizenIDData | null = null;
    let backData: CitizenIDBackData | null = null;
    
    if (isFrontData(frontResult)) {
        frontData = frontResult;
    } else if (isBackData(frontResult)) {
        backData = frontResult;
    }
    
    if (isFrontData(backResult)) {
        frontData = backResult;
    } else if (isBackData(backResult)) {
        backData = backResult;
    }
    
    if (!frontData) {
        throw new Error('Could not find front side data in uploaded images');
    }
    
    if (!backData) {
        throw new Error('Could not find back side data in uploaded images');
    }
    
    return {
        id: frontData.id !== 'N/A' ? frontData.id : '',
        name: frontData.name !== 'N/A' ? frontData.name : '',
        dob: parseFPTDate(frontData.dob) || '',
        address: (frontData.address !== 'N/A' ? frontData.address : '') || 
                (frontData.home !== 'N/A' ? frontData.home : ''),
        issueDate: parseFPTDate(backData.issue_date) || '',
        expiryDate: parseFPTDate(frontData.doe) || '',
        authority: backData.issue_loc !== 'N/A' ? backData.issue_loc : '',
    };
};