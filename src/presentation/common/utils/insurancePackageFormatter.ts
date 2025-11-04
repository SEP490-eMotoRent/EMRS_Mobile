import { InsurancePackage } from '../../../domain/entities/insurance/InsurancePackage';

/**
 * Format currency in Vietnamese Dong
 */
export const formatVND = (amount: number): string => {
    if (amount === 0) return 'FREE';
    return `${amount.toLocaleString('vi-VN')}đ`;
};

/**
 * Format coverage amount (in millions)
 */
export const formatCoverage = (amount: number): string => {
    const millions = amount / 1000000;
    return `${millions.toLocaleString('vi-VN')}M VND`;
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
                icon: '🛡️',
                iconColor: '#3b82f6',
                priceColor: '#3b82f6',
            };
        case 'STANDARD':
            return {
                icon: '🟢',
                iconColor: '#22c55e',
                priceColor: '#22c55e',
            };
        case 'PREMIUM':
            return {
                icon: '🟡',
                iconColor: '#eab308',
                priceColor: '#d4c5f9',
            };
        default:
            return {
                icon: '📋',
                iconColor: '#6b7280',
                priceColor: '#6b7280',
            };
    }
};

/**
 * Build feature list from insurance package
 */
export const buildFeatureList = (pkg: InsurancePackage): string[] => {
    const features: string[] = [];

    if (pkg.coveragePersonLimit > 0) {
        features.push(
            `Personal injury: ${formatCoverage(pkg.coveragePersonLimit)}/person`
        );
    }

    if (pkg.coveragePropertyLimit > 0) {
        features.push(
            `Property damage: ${formatCoverage(pkg.coveragePropertyLimit)}/incident`
        );
    }

    if (pkg.coverageVehiclePercentage > 0) {
        const coverageText = pkg.coverageVehiclePercentage >= 90 
            ? 'Comprehensive vehicle coverage'
            : 'Vehicle damage';
        features.push(`${coverageText}: ${pkg.coverageVehiclePercentage}% coverage`);
    } else {
        features.push('Vehicle damage: Not covered');
    }

    if (pkg.coverageTheft > 0) {
        features.push(`Theft coverage: ${formatCoverage(pkg.coverageTheft)}`);
    }

    if (pkg.deductibleAmount > 0) {
        features.push(`Deductible: ${formatVND(pkg.deductibleAmount)}`);
    }

    // Add custom description if available
    if (pkg.description && pkg.description.trim() !== '') {
        features.push(pkg.description);
    }

    return features;
};

/**
 * Transform InsurancePackage entity to UI display format
 */
export const transformToInsurancePlan = (pkg: InsurancePackage) => {
    const displayInfo = getPackageDisplayInfo(pkg.packageName);
    
    return {
        id: pkg.id,
        icon: displayInfo.icon,
        iconColor: displayInfo.iconColor,
        title: pkg.packageName.charAt(0) + pkg.packageName.slice(1).toLowerCase() + ' Protection',
        price: formatVND(pkg.packageFee),
        priceColor: displayInfo.priceColor,
        description: pkg.description || '',
        features: buildFeatureList(pkg),
    };
};