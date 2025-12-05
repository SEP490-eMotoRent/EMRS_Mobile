export interface ZaloPayCallbackRequest {
    AppId: number;
    AppTransId: string;
    PmcId: number;
    BankCode: string;
    Amount: number;
    DiscountAmount: number;
    Status: number;
    Checksum: string;
    Message: string;
}