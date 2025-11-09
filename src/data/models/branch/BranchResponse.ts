export interface BranchResponse {
    id: string;
    branchName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    latitude: number;
    longitude: number;
    openingTime: string;
    closingTime: string;
    vehicleCount?: number; //Optional field
}