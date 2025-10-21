export interface BaseEntity {
    id: string; // UUID
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    isDeleted: boolean;
}

export type CreateEntityInput<T extends BaseEntity> = Omit<
    T,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
>;

export type UpdateEntityInput<T extends BaseEntity> = Partial<
    Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'>
>;