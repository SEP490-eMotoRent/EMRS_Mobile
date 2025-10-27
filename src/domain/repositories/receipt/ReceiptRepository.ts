import { CreateHandoverReceiptUseCaseInput } from "../../usecases/receipt/CreateHandoverReceiptUseCase";

export interface ReceiptRepository {
  createHandoverReceipt(
    input: CreateHandoverReceiptUseCaseInput
  ): Promise<void>;
}
