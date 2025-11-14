import { InsurancePackage } from '../../../domain/entities/insurance/InsurancePackage';

/**
 * Format currency in Vietnamese Dong
 */
export const formatVND = (amount: number): string => {
    if (amount === 0) return 'MIỄN PHÍ'; // ✅ Changed from 'FREE'
    return `${amount.toLocaleString('vi-VN')}đ`;
};

/**
 * Format coverage amount (in millions) - Vietnamese
 */
export const formatCoverage = (amount: number): string => {
    const millions = amount / 1000000;
    return `${millions.toLocaleString('vi-VN')} triệu đồng`; // ✅ Vietnamese format
};

/**
 * Get icon and color for package name
 */
export const getPackageDisplayInfo = (packageName: string): {
    icon: string;
    iconColor: string;
    priceColor: string;
} => {
    const name = packageName.toUpperCase();
    
    switch (name) {
        case 'BASIC':
            return {
                icon: '◈', // ✅ Unicode diamond instead of emoji
                iconColor: '#3b82f6',
                priceColor: '#3b82f6',
            };
        case 'STANDARD':
            return {
                icon: '◐', // ✅ Unicode half circle
                iconColor: '#22c55e',
                priceColor: '#22c55e',
            };
        case 'PREMIUM':
            return {
                icon: '★', // ✅ Unicode star
                iconColor: '#eab308',
                priceColor: '#d4c5f9',
            };
        default:
            return {
                icon: '◈', // ✅ Unicode fallback
                iconColor: '#6b7280',
                priceColor: '#6b7280',
            };
    }
};

/**
 * Build feature list from insurance package - ALL VIETNAMESE
 */
export const buildFeatureList = (pkg: InsurancePackage): string[] => {
    const features: string[] = [];

    // ✅ Vietnamese: Personal injury coverage
    if (pkg.coveragePersonLimit > 0) {
        features.push(
            `Bồi thường thiệt hại cá nhân: ${formatCoverage(pkg.coveragePersonLimit)}/người`
        );
    }

    // ✅ Vietnamese: Property damage coverage
    if (pkg.coveragePropertyLimit > 0) {
        features.push(
            `Bồi thường thiệt hại tài sản: ${formatCoverage(pkg.coveragePropertyLimit)}/vụ`
        );
    }

    // ✅ Vietnamese: Vehicle coverage
    if (pkg.coverageVehiclePercentage > 0) {
        const coverageText = pkg.coverageVehiclePercentage >= 90 
            ? 'Bảo hiểm xe toàn diện'
            : 'Bảo hiểm thiệt hại xe';
        features.push(`${coverageText}: Bồi thường ${pkg.coverageVehiclePercentage}% giá trị xe`);
    } else {
        features.push('Bảo hiểm thiệt hại xe: Không bao gồm');
    }

    // ✅ Vietnamese: Theft coverage
    if (pkg.coverageTheft > 0) {
        features.push(`Bảo hiểm trộm cắp: ${formatCoverage(pkg.coverageTheft)}`);
    }

    // ✅ Vietnamese: Deductible
    if (pkg.deductibleAmount > 0) {
        features.push(`Mức khấu trừ: ${formatVND(pkg.deductibleAmount)}`);
    }

    // ⚠️ REMOVED: Don't add description here - it's already used as card description
    // This was causing the duplicate!

    return features;
};

/**
 * Transform InsurancePackage entity to UI display format
 */
export const transformToInsurancePlan = (pkg: InsurancePackage) => {
    const displayInfo = getPackageDisplayInfo(pkg.packageName);
    
    // ✅ Vietnamese title format
    const titleMap: { [key: string]: string } = {
        'BASIC': 'Basic Protection',
        'STANDARD': 'Standard Protection',
        'PREMIUM': 'Premium Protection',
    };
    
    return {
        id: pkg.id,
        icon: displayInfo.icon,
        iconColor: displayInfo.iconColor,
        title: titleMap[pkg.packageName.toUpperCase()] || pkg.packageName + ' Protection',
        price: formatVND(pkg.packageFee),
        priceColor: displayInfo.priceColor,
        description: pkg.description || '', // ✅ Description stays in description field only
        features: buildFeatureList(pkg), // ✅ Features are separate, no duplicate
    };
};