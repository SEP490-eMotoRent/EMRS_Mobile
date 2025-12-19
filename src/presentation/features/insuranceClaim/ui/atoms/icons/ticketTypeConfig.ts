import { TicketTypeEnum } from '../../../../../../domain/entities/operations/tickets/TicketEnums';
import { IconProps } from './Icon';

export interface TicketTypeConfig {
    type: TicketTypeEnum;
    label: string;
    icon: IconProps['name'];
    color: string;
    description: string;
}

export const TICKET_TYPE_CONFIGS: Record<TicketTypeEnum, TicketTypeConfig> = {
    [TicketTypeEnum.WeakBattery]: {
        type: TicketTypeEnum.WeakBattery,
        label: 'Yếu pin',
        icon: 'battery-low',
        color: '#f59e0b',
        description: 'Pin yếu hoặc hết pin bất thường',
    },
    [TicketTypeEnum.FlatTyre]: {
        type: TicketTypeEnum.FlatTyre,
        label: 'Xẹp lốp',
        icon: 'tire-flat',
        color: '#ef4444',
        description: 'Lốp xe bị xẹp hoặc hư hỏng',
    },
    [TicketTypeEnum.UsageGuidance]: {
        type: TicketTypeEnum.UsageGuidance,
        label: 'Hướng dẫn sử dụng',
        icon: 'question-circle',
        color: '#3b82f6',
        description: 'Cần hướng dẫn sử dụng xe',
    },
    [TicketTypeEnum.OtherTechnical]: {
        type: TicketTypeEnum.OtherTechnical,
        label: 'Kỹ thuật khác',
        icon: 'tools',
        color: '#8b5cf6',
        description: 'Các vấn đề kỹ thuật khác',
    },
};

export const getTicketTypeConfig = (ticketType: TicketTypeEnum): TicketTypeConfig => {
    return TICKET_TYPE_CONFIGS[ticketType] || TICKET_TYPE_CONFIGS[TicketTypeEnum.OtherTechnical];
};