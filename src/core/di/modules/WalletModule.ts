import { AxiosClient } from '../../network/AxiosClient';

// Data Sources
import { WalletRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/wallet/WalletRemoteDataSourceImpl';
import { WithdrawalRequestRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/withdrawRequest/WithdrawalRequestRemoteDataSourceImpl';
import { TransactionRemoteDataSourceImpl } from '../../../data/datasources/implementations/remote/transaction/TransactionRemoteDataSourceImpl';

// Repositories
import { WalletRepositoryImpl } from '../../../data/repositories/wallet/WalletRepositoryImpl';
import { WithdrawalRequestRepositoryImpl } from '../../../data/repositories/withdrawRequest/WithdrawalRequestRepositoryImpl';
import { TransactionRepositoryImpl } from '../../../data/repositories/financial/TransactionRepositoryImpl';

// Use Cases - Wallet
import { CreateWalletUseCase } from '../../../domain/usecases/wallet/CreateWalletUseCase';
import { GetWalletBalanceUseCase } from '../../../domain/usecases/wallet/GetWalletBalanceUseCase';

// Use Cases - Top-up
import { CreateTopUpRequestUseCase } from '../../../domain/usecases/wallet/topUp/CreateTopUpRequestUseCase';
import { ProcessTopUpCallbackUseCase } from '../../../domain/usecases/wallet/topUp/ProcessTopUpCallbackUseCase';

// Use Cases - Withdrawal
import { CreateWithdrawalRequestUseCase } from '../../../domain/usecases/withdrawRequest/CreateWithdrawalRequestUseCase';
import { GetMyWithdrawalRequestsUseCase } from '../../../domain/usecases/withdrawRequest/GetMyWithdrawalRequestsUseCase';
import { GetWithdrawalRequestDetailUseCase } from '../../../domain/usecases/withdrawRequest/GetWithdrawalRequestDetailUseCase';
import { CancelWithdrawalRequestUseCase } from '../../../domain/usecases/withdrawRequest/CancelWithdrawalRequestUseCase';

// Use Cases - Transaction
import { GetMyTransactionsUseCase } from '../../../domain/usecases/transaction/GetMyTransactionsUseCase';

/**
 * WalletModule - Complete Wallet Domain
 * 
 * Handles all wallet-related functionality:
 * - Wallet creation and balance management
 * - Top-up requests (VNPay integration)
 * - Withdrawal requests
 * - Transaction history
 * 
 * Migrated from InjectionContainer - 100% complete
 */
export class WalletModule {
    // ==================== REPOSITORIES ====================
    private _walletRepository: WalletRepositoryImpl | null = null;
    private _withdrawalRequestRepository: WithdrawalRequestRepositoryImpl | null = null;
    private _transactionRepository: TransactionRepositoryImpl | null = null;

    // ==================== USE CASES - WALLET ====================
    private _createWalletUseCase: CreateWalletUseCase | null = null;
    private _getWalletBalanceUseCase: GetWalletBalanceUseCase | null = null;

    // ==================== USE CASES - TOP-UP ====================
    private _createTopUpRequestUseCase: CreateTopUpRequestUseCase | null = null;
    private _processTopUpCallbackUseCase: ProcessTopUpCallbackUseCase | null = null;

    // ==================== USE CASES - WITHDRAWAL ====================
    private _createWithdrawalRequestUseCase: CreateWithdrawalRequestUseCase | null = null;
    private _getMyWithdrawalRequestsUseCase: GetMyWithdrawalRequestsUseCase | null = null;
    private _getWithdrawalRequestDetailUseCase: GetWithdrawalRequestDetailUseCase | null = null;
    private _cancelWithdrawalRequestUseCase: CancelWithdrawalRequestUseCase | null = null;

    // ==================== USE CASES - TRANSACTION ====================
    private _getMyTransactionsUseCase: GetMyTransactionsUseCase | null = null;

    constructor(private axiosClient: AxiosClient) {}

    static create(axiosClient: AxiosClient): WalletModule {
        return new WalletModule(axiosClient);
    }

    // ==================== PUBLIC API - REPOSITORIES ====================

    get repository(): WalletRepositoryImpl {
        if (!this._walletRepository) {
        const remoteDataSource = new WalletRemoteDataSourceImpl(this.axiosClient);
        this._walletRepository = new WalletRepositoryImpl(remoteDataSource);
        }
        return this._walletRepository;
    }

    get withdrawalRepository(): WithdrawalRequestRepositoryImpl {
        if (!this._withdrawalRequestRepository) {
        const remoteDataSource = new WithdrawalRequestRemoteDataSourceImpl(this.axiosClient);
        this._withdrawalRequestRepository = new WithdrawalRequestRepositoryImpl(remoteDataSource);
        }
        return this._withdrawalRequestRepository;
    }

    get transactionRepository(): TransactionRepositoryImpl {
        if (!this._transactionRepository) {
        const remoteDataSource = new TransactionRemoteDataSourceImpl(this.axiosClient);
        this._transactionRepository = new TransactionRepositoryImpl(remoteDataSource);
        }
        return this._transactionRepository;
    }

    // ==================== PUBLIC API - USE CASES ====================

    /**
     * Wallet balance use cases
     * Usage: container.wallet.balance.get.execute()
     */
    get balance() {
        return {
        get: this.getWalletBalanceUseCase,
        create: this.createWalletUseCase,
        };
    }

    /**
     * Top-up use cases
     * Usage: container.wallet.topUp.create.execute()
     */
    get topUp() {
        return {
        create: this.createTopUpRequestUseCase,
        processCallback: this.processTopUpCallbackUseCase,
        };
    }

    /**
     * Withdrawal use cases
     * Usage: container.wallet.withdrawal.create.execute()
     */
    get withdrawal() {
        return {
        create: this.createWithdrawalRequestUseCase,
        getMy: this.getMyWithdrawalRequestsUseCase,
        getDetail: this.getWithdrawalRequestDetailUseCase,
        cancel: this.cancelWithdrawalRequestUseCase,
        };
    }

    /**
     * Transaction history use cases
     * Usage: container.wallet.transactions.getMy.execute()
     */
    get transactions() {
        return {
        getMy: this.getMyTransactionsUseCase,
        };
    }

    // ==================== PRIVATE GETTERS - WALLET ====================

    private get createWalletUseCase(): CreateWalletUseCase {
        if (!this._createWalletUseCase) {
        this._createWalletUseCase = new CreateWalletUseCase(this.repository);
        }
        return this._createWalletUseCase;
    }

    private get getWalletBalanceUseCase(): GetWalletBalanceUseCase {
        if (!this._getWalletBalanceUseCase) {
        this._getWalletBalanceUseCase = new GetWalletBalanceUseCase(this.repository);
        }
        return this._getWalletBalanceUseCase;
    }

    // ==================== PRIVATE GETTERS - TOP-UP ====================

    private get createTopUpRequestUseCase(): CreateTopUpRequestUseCase {
        if (!this._createTopUpRequestUseCase) {
        this._createTopUpRequestUseCase = new CreateTopUpRequestUseCase(this.repository);
        }
        return this._createTopUpRequestUseCase;
    }

    private get processTopUpCallbackUseCase(): ProcessTopUpCallbackUseCase {
        if (!this._processTopUpCallbackUseCase) {
        this._processTopUpCallbackUseCase = new ProcessTopUpCallbackUseCase(this.repository);
        }
        return this._processTopUpCallbackUseCase;
    }

    // ==================== PRIVATE GETTERS - WITHDRAWAL ====================

    private get createWithdrawalRequestUseCase(): CreateWithdrawalRequestUseCase {
        if (!this._createWithdrawalRequestUseCase) {
        this._createWithdrawalRequestUseCase = new CreateWithdrawalRequestUseCase(this.withdrawalRepository);
        }
        return this._createWithdrawalRequestUseCase;
    }

    private get getMyWithdrawalRequestsUseCase(): GetMyWithdrawalRequestsUseCase {
        if (!this._getMyWithdrawalRequestsUseCase) {
        this._getMyWithdrawalRequestsUseCase = new GetMyWithdrawalRequestsUseCase(this.withdrawalRepository);
        }
        return this._getMyWithdrawalRequestsUseCase;
    }

    private get getWithdrawalRequestDetailUseCase(): GetWithdrawalRequestDetailUseCase {
        if (!this._getWithdrawalRequestDetailUseCase) {
        this._getWithdrawalRequestDetailUseCase = new GetWithdrawalRequestDetailUseCase(this.withdrawalRepository);
        }
        return this._getWithdrawalRequestDetailUseCase;
    }

    private get cancelWithdrawalRequestUseCase(): CancelWithdrawalRequestUseCase {
        if (!this._cancelWithdrawalRequestUseCase) {
        this._cancelWithdrawalRequestUseCase = new CancelWithdrawalRequestUseCase(this.withdrawalRepository);
        }
        return this._cancelWithdrawalRequestUseCase;
    }

    // ==================== PRIVATE GETTERS - TRANSACTION ====================

    private get getMyTransactionsUseCase(): GetMyTransactionsUseCase {
        if (!this._getMyTransactionsUseCase) {
        this._getMyTransactionsUseCase = new GetMyTransactionsUseCase(this.transactionRepository);
        }
        return this._getMyTransactionsUseCase;
    }
}