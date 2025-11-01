export interface UpdateRenterRequest {
    Email: string;              // ⚠️ Capital 'E' - REQUIRED
    phone: string;              // ⚠️ Lowercase 'p' - REQUIRED
    Address: string;            // ⚠️ Capital 'A' - REQUIRED
    DateOfBirth?: string;
    MediaId?: string;
    Fullname?: string;
    ProfilePicture?: {
        uri: string;
        name: string;
        type: string;
    };
}