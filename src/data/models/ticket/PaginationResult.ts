export interface PaginationResult<T> {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    items: T;
}