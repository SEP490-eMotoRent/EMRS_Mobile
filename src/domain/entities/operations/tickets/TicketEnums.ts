export enum TicketTypeEnum {
    WeakBattery = 0,
    FlatTyre = 1,
    UsageGuidance = 2,
    OtherTechnical = 3
}

export enum TicketStatusEnum {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Resolved = 'Resolved',
}

export const TicketTypeDisplay: Record<string, string> = {
    'WeakBattery': 'Yếu pin',
    'FlatTyre': 'Xẹp lốp',
    'UsageGuidance': 'Hướng dẫn sử dụng',
    'OtherTechnical': 'Kỹ thuật khác'
};

export const TicketStatusDisplay: Record<string, string> = {
    'Pending': 'Chờ xử lý',
    'InProgress': 'Đang xử lý',
    'Resolved': 'Đã giải quyết',
};