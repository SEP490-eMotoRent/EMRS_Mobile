export interface AnalyzeReturnResponse {
    uploadedImageUrls: string[];
    verificationResult: VerificationResult;
    damageResult: DamageResult;
}

interface VerificationResult {
    isVerified: boolean;
    confidence: number;
    reason: string;
    licensePlateMatch: string;
}

interface DamageResult {
    hasNewDamages: boolean;
    suggestions: string[];
}