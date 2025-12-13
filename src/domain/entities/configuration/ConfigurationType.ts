/**
 * Configuration Type Enum
 * Matches backend ConfigurationTypeEnum exactly
 * 
 * Last synced: 2025-12-13
 */
export enum ConfigurationType {
    // Removed: FacePlusPlus = 1 (commented out in backend)
    
    /** Renting duration rate configuration */
    RentingDurationRate = 2,
    
    /** Charging rate configuration */
    ChargingRate = 3,
    
    /** Deposit rate configuration */
    DepositRate = 5,
    
    /** Additional fee configuration */
    AdditionalFee = 6,
    
    /** Refund rate configuration */
    RefundRate = 7,
    
    /** Economy tier deposit price */
    EconomyDepositPrice = 8,
    
    /** Standard tier deposit price */
    StandardDepositPrice = 9,
    
    /** Premium tier deposit price */
    PremiumDepositPrice = 10,
    
    /** Off-peak charging price */
    OffPeakChargingPrice = 11,
    
    /** Normal charging price */
    NormalChargingPrice = 12,
    
    /** Peak charging price */
    PeakChargingPrice = 13,
    
    /** Rental contract template (PDF) */
    RentalContractTemplate = 17,
    
    /** Late return price */
    LateReturnPrice = 18,
    
    /** Cleaning price */
    CleaningPrice = 19,
    
    /** Damage price */
    DamagePrice = 20,
    
    /** Cross-branch return price */
    CrossBranchPrice = 21,
    
    /** Economy tier excess km price */
    EconomyExcessKmPrice = 22,
    
    /** Standard tier excess km price */
    StandardExcessKmPrice = 23,
    
    /** Premium tier excess km price */
    PremiumExcessKmPrice = 24,
    
    /** Economy tier excess km limit */
    EconomyExcessKmLimit = 25,
    
    /** Standard tier excess km limit */
    StandardExcessKmLimit = 26,
    
    /** Premium tier excess km limit */
    PremiumExcessKmLimit = 27,
}

/**
 * Helper to get configuration type display name in Vietnamese
 */
export const ConfigurationTypeDisplay: Record<ConfigurationType, string> = {
    [ConfigurationType.RentingDurationRate]: "Giá thuê theo thời gian",
    [ConfigurationType.ChargingRate]: "Phí sạc điện",
    [ConfigurationType.DepositRate]: "Tỷ lệ đặt cọc",
    [ConfigurationType.AdditionalFee]: "Phí phụ trội",
    [ConfigurationType.RefundRate]: "Tỷ lệ hoàn tiền",
    [ConfigurationType.EconomyDepositPrice]: "Tiền cọc xe Tiết kiệm",
    [ConfigurationType.StandardDepositPrice]: "Tiền cọc xe Tiêu chuẩn",
    [ConfigurationType.PremiumDepositPrice]: "Tiền cọc xe Cao cấp",
    [ConfigurationType.OffPeakChargingPrice]: "Giá sạc ngoài giờ cao điểm",
    [ConfigurationType.NormalChargingPrice]: "Giá sạc giờ bình thường",
    [ConfigurationType.PeakChargingPrice]: "Giá sạc giờ cao điểm",
    [ConfigurationType.RentalContractTemplate]: "Mẫu hợp đồng thuê xe",
    [ConfigurationType.LateReturnPrice]: "Phí trả xe trễ",
    [ConfigurationType.CleaningPrice]: "Phí vệ sinh xe",
    [ConfigurationType.DamagePrice]: "Phí hư hỏng",
    [ConfigurationType.CrossBranchPrice]: "Phí trả xe khác chi nhánh",
    [ConfigurationType.EconomyExcessKmPrice]: "Phí vượt km - Xe Tiết kiệm",
    [ConfigurationType.StandardExcessKmPrice]: "Phí vượt km - Xe Tiêu chuẩn",
    [ConfigurationType.PremiumExcessKmPrice]: "Phí vượt km - Xe Cao cấp",
    [ConfigurationType.EconomyExcessKmLimit]: "Giới hạn km - Xe Tiết kiệm",
    [ConfigurationType.StandardExcessKmLimit]: "Giới hạn km - Xe Tiêu chuẩn",
    [ConfigurationType.PremiumExcessKmLimit]: "Giới hạn km - Xe Cao cấp",
};

/**
 * Type guard to check if a number is a valid ConfigurationType
 */
export function isValidConfigurationType(type: number): type is ConfigurationType {
    return Object.values(ConfigurationType).includes(type);
}

/**
 * Get display name for a configuration type
 * @param type - The configuration type enum value
 * @returns Vietnamese display name or "Unknown" if not found
 */
export function getConfigurationTypeDisplayName(type: ConfigurationType): string {
    return ConfigurationTypeDisplay[type] || "Không xác định";
}