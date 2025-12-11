export interface UpdateRenterResponse {
    Id: string;
    Email: string;
    phone: string;
    Address: string;
    DateOfBirth?: string;
    ProfilePicture: string | null;
    account: RenterAccountResponse;
}

export interface RenterAccountResponse {
    Id: string;
    Username: string;
    Role: string;
    Fullname?: string;
}