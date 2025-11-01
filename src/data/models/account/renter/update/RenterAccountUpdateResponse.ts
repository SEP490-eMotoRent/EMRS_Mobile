export interface UpdateRenterResponse {
    Id: string;                 // Capital 'I' - Guid in C#
    Email: string;              // Capital 'E'
    phone: string;              // Lowercase 'p'
    Address: string;            // Capital 'A'
    DateOfBirth?: string;       // Optional - DD/MM/YYYY format from backend
    AvatarUrl: string;          // Capital 'A', capital 'U' - URL to profile picture
    account: RenterAccountResponse;   // Lowercase 'a' - nested account info
}

export interface RenterAccountResponse {
    Id: string;                 // Capital 'I' - Guid in C#
    Username: string;           // Capital 'U'
    Role: string;               // Capital 'R'
    Fullname?: string;          // Optional - Capital 'F'
}