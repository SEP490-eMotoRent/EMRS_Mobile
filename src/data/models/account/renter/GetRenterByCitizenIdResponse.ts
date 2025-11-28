export interface GetRenterByCitizenIdResponse {
    id: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    avatarUrl: string | null;
    faceScanUrl: string;
    account: {
        id: string;
        username: string;
        role: string;
        fullname: string;
    };
}