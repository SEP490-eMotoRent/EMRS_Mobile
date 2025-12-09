import { AxiosClient } from "../../network/AxiosClient";

// Data Sources
import { TransactionRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/transaction/TransactionRemoteDataSourceImpl";
import { WalletRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/wallet/WalletRemoteDataSourceImpl";
import { WithdrawalRequestRemoteDataSourceImpl } from "../../../data/datasources/implementations/remote/withdrawRequest/WithdrawalRequestRemoteDataSourceImpl";

// Repositories
import { TransactionRepositoryImpl } from "../../../data/repositories/financial/TransactionRepositoryImpl";
import { WalletRepositoryImpl } from "../../../data/repositories/wallet/WalletRepositoryImpl";
import { WithdrawalRequestRepositoryImpl } from "../../../data/repositories/withdrawRequest/WithdrawalRequestRepositoryImpl";
import { TransactionRepository } from "../../../domain/repositories/financial/TransactionRepository";
import { WalletRepository } from "../../../domain/repositories/wallet/WalletRepository";
import { WithdrawalRequestRepository } from "../../../domain/repositories/withdrawRequest/WithdrawalRequestRepository";

// Use Cases
import { GetMyTransactionsUseCase } from "../../../domain/usecases/transaction/GetMyTransactionsUseCase";
import { CreateWalletUseCase } from "../../../domain/usecases/wallet/CreateWalletUseCase";
import { GetWalletBalanceUseCase } from "../../../domain/usecases/wallet/GetWalletBalanceUseCase";
import { CreateTopUpRequestUseCase } from "../../../domain/usecases/wallet/topUp/CreateTopUpRequestUseCase";
import { ProcessTopUpCallbackUseCase } from "../../../domain/usecases/wallet/topUp/ProcessTopUpCallbackUseCase";
import { CancelWithdrawalRequestUseCase } from "../../../domain/usecases/withdrawRequest/CancelWithdrawalRequestUseCase";
import { CreateWithdrawalRequestUseCase } from "../../../domain/usecases/withdrawRequest/CreateWithdrawalRequestUseCase";
import { GetMyWithdrawalRequestsUseCase } from "../../../domain/usecases/withdrawRequest/GetMyWithdrawalRequestsUseCase";
import { GetWithdrawalRequestDetailUseCase } from "../../../domain/usecases/withdrawRequest/GetWithdrawalRequestDetailUseCase";

/**
 * WalletModule - All wallet-related functionality
 * 
 * Includes:
 * - Wallet balance management
 * - Top-up operations
 * - Withdrawal requests
 * - Transaction history
 */
export class WalletModule {
    // Data Sources
    public readonly remoteDataSource: WalletRemoteDataSourceImpl;
    public readonly transactionRemoteDataSource: TransactionRemoteDataSourceImpl;
    public readonly withdrawalRequestRemoteDataSource: WithdrawalRequestRemoteDataSourceImpl;

    // Repositories
    public readonly repository: WalletRepository;
    public readonly transactionRepository: TransactionRepository;
    public readonly withdrawalRequestRepository: WithdrawalRequestRepository;

    // Use Cases - Organized by feature
    public readonly balance = {
        get: {} as GetWalletBalanceUseCase,
        create: {} as CreateWalletUseCase,
    };

    public readonly topUp = {
        create: {} as CreateTopUpRequestUseCase,
        processCallback: {} as ProcessTopUpCallbackUseCase,
    };

    public readonly withdrawal = {
        create: {} as CreateWithdrawalRequestUseCase,
        getRequests: {} as GetMyWithdrawalRequestsUseCase,
        getDetail: {} as GetWithdrawalRequestDetailUseCase,
        cancel: {} as CancelWithdrawalRequestUseCase,
    };

    public readonly transactions = {
        getAll: {} as GetMyTransactionsUseCase,
    };

    constructor(axiosClient: AxiosClient) {
        // Initialize data sources
        this.remoteDataSource = new WalletRemoteDataSourceImpl(axiosClient);
        this.transactionRemoteDataSource = new TransactionRemoteDataSourceImpl(axiosClient);
        this.withdrawalRequestRemoteDataSource = new WithdrawalRequestRemoteDataSourceImpl(axiosClient);

        // Initialize repositories
        this.repository = new WalletRepositoryImpl(this.remoteDataSource);
        this.transactionRepository = new TransactionRepositoryImpl(this.transactionRemoteDataSource);
        this.withdrawalRequestRepository = new WithdrawalRequestRepositoryImpl(this.withdrawalRequestRemoteDataSource);

        // Initialize balance use cases
        this.balance.get = new GetWalletBalanceUseCase(this.repository);
        this.balance.create = new CreateWalletUseCase(this.repository);

        // Initialize top-up use cases
        this.topUp.create = new CreateTopUpRequestUseCase(this.repository);
        this.topUp.processCallback = new ProcessTopUpCallbackUseCase(this.repository);

        // Initialize withdrawal use cases
        this.withdrawal.create = new CreateWithdrawalRequestUseCase(this.withdrawalRequestRepository);
        this.withdrawal.getRequests = new GetMyWithdrawalRequestsUseCase(this.withdrawalRequestRepository);
        this.withdrawal.getDetail = new GetWithdrawalRequestDetailUseCase(this.withdrawalRequestRepository);
        this.withdrawal.cancel = new CancelWithdrawalRequestUseCase(this.withdrawalRequestRepository);

        // Initialize transaction use cases
        this.transactions.getAll = new GetMyTransactionsUseCase(this.transactionRepository);
    }

    static create(axiosClient: AxiosClient): WalletModule {
        return new WalletModule(axiosClient);
    }
}