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
    Closed = 'Closed'
}

// Helper to get display text
export const TicketTypeDisplay: Record<TicketTypeEnum, string> = {
    [TicketTypeEnum.WeakBattery]: 'Yếu pin',
    [TicketTypeEnum.FlatTyre]: 'Xẹp lốp',
    [TicketTypeEnum.UsageGuidance]: 'Hướng dẫn sử dụng',
    [TicketTypeEnum.OtherTechnical]: 'Kỹ thuật khác'
};

export const TicketStatusDisplay: Record<string, string> = {
    'Pending': 'Chờ xử lý',
    'InProgress': 'Đang xử lý',
    'Resolved': 'Đã giải quyết',
    'Closed': 'Đã đóng'
};