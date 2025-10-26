import { Vehicle } from "./Vehicle";

export interface PaginatedVehicleResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: Vehicle[];
}
