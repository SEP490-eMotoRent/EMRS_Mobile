import log from 'loglevel';

// Configure loglevel
log.setLevel('debug'); // Set to desired level: trace, debug, info, warn, error

export class AppLogger {
    private static instance: AppLogger;

    private constructor() {
        // Private constructor for singleton pattern
    }

    static getInstance(): AppLogger {
        if (!AppLogger.instance) {
            AppLogger.instance = new AppLogger();
        }
        return AppLogger.instance;
    }

    debug(message: string): void {
        // log.debug(`🛠 [DEBUG] ${message}`);
    }

    info(message: string): void {
        // log.info(`ℹ️ [INFO] ${message}`);
    }

    warn(message: string): void {
        // log.warn(`⚠️ [WARN] ${message}`);
    }

    error(message: string): void {
        // log.error(`❌ [ERROR] ${message}`);
    }
}