export interface UpdateRenterRequest {
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    mediaId: string;      // UUID for profile picture
    fullname: string;     // This updates Account.fullname
    profilePicture?: File; // For file upload ($binary)
}