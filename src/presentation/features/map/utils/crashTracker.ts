/**
 * Crash Tracker Utility
 * Logs crashes, errors, and critical events with context
 */

import { Platform } from 'react-native';

interface CrashLog {
    timestamp: string;
    type: 'JS_ERROR' | 'NATIVE_CRASH' | 'PROMISE_REJECTION' | 'ANIMATION_ERROR' | 'STATE_ERROR';
    error: string;
    stack?: string;
    context: {
        platform: string;
        isEmulator: boolean;
        screen?: string;
        action?: string;
        state?: any;
    };
    breadcrumbs: string[];
}

class CrashTracker {
    private breadcrumbs: string[] = [];
    private maxBreadcrumbs = 20;
    private crashes: CrashLog[] = [];
    private maxCrashes = 10;
    private currentScreen: string = 'Unknown';
    private currentAction: string = 'None';

    constructor() {
        this.setupGlobalErrorHandlers();
    }

    private setupGlobalErrorHandlers() {
        // ✅ Catch unhandled promise rejections
        if (typeof global !== 'undefined') {
            const originalHandler = global.Promise.prototype.catch;
            global.Promise.prototype.catch = function(onRejected) {
                return originalHandler.call(this, (error: any) => {
                    CrashTracker.getInstance().logError(
                        'PROMISE_REJECTION',
                        error,
                        'Unhandled Promise Rejection'
                    );
                    if (onRejected) {
                        return onRejected(error);
                    }
                    throw error;
                });
            };
        }

        // ✅ Log when errors are thrown
        const originalConsoleError = console.error;
        console.error = (...args: any[]) => {
            const errorMessage = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            
            if (errorMessage.includes('Warning:')) {
                // Skip React warnings
                originalConsoleError(...args);
                return;
            }

            this.addBreadcrumb(`❌ Console Error: ${errorMessage}`);
            originalConsoleError(...args);
        };
    }

    private static instance: CrashTracker;

    static getInstance(): CrashTracker {
        if (!CrashTracker.instance) {
            CrashTracker.instance = new CrashTracker();
        }
        return CrashTracker.instance;
    }

    // ✅ Add breadcrumb (what happened before crash)
    addBreadcrumb(message: string) {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const breadcrumb = `[${timestamp}] ${message}`;
        
        this.breadcrumbs.push(breadcrumb);
        
        if (this.breadcrumbs.length > this.maxBreadcrumbs) {
            this.breadcrumbs.shift();
        }

        console.log(`🍞 ${breadcrumb}`);
    }

    // ✅ Set current screen/action for context
    setContext(screen?: string, action?: string) {
        if (screen) this.currentScreen = screen;
        if (action) this.currentAction = action;
    }

    // ✅ Log an error/crash
    logError(
        type: CrashLog['type'],
        error: any,
        customMessage?: string,
        additionalState?: any
    ) {
        const errorMessage = error instanceof Error 
            ? error.message 
            : String(error);
        
        const stack = error instanceof Error 
            ? error.stack 
            : undefined;

        const crashLog: CrashLog = {
            timestamp: new Date().toISOString(),
            type,
            error: customMessage || errorMessage,
            stack,
            context: {
                platform: Platform.OS,
                isEmulator: this.isEmulator(),
                screen: this.currentScreen,
                action: this.currentAction,
                state: additionalState,
            },
            breadcrumbs: [...this.breadcrumbs], // Copy breadcrumbs
        };

        this.crashes.push(crashLog);
        
        if (this.crashes.length > this.maxCrashes) {
            this.crashes.shift();
        }

        // ✅ Log to console with full details
        console.log('\n🔥🔥🔥 CRASH DETECTED 🔥🔥🔥');
        console.log(`Type: ${type}`);
        console.log(`Error: ${errorMessage}`);
        console.log(`Screen: ${this.currentScreen}`);
        console.log(`Action: ${this.currentAction}`);
        console.log('Last 10 breadcrumbs:');
        this.breadcrumbs.slice(-10).forEach(b => console.log(`  ${b}`));
        
        if (stack) {
            console.log('\nStack trace:');
            console.log(stack);
        }
        
        if (additionalState) {
            console.log('\nAdditional state:');
            console.log(JSON.stringify(additionalState, null, 2));
        }
        
        console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥\n');
    }

    // ✅ Get crash report
    getCrashReport(): string {
        if (this.crashes.length === 0) {
            return 'No crashes recorded';
        }

        let report = '=== CRASH REPORT ===\n\n';
        
        this.crashes.forEach((crash, index) => {
            report += `Crash #${index + 1}\n`;
            report += `Timestamp: ${crash.timestamp}\n`;
            report += `Type: ${crash.type}\n`;
            report += `Error: ${crash.error}\n`;
            report += `Platform: ${crash.context.platform} ${crash.context.isEmulator ? '(Emulator)' : '(Device)'}\n`;
            report += `Screen: ${crash.context.screen}\n`;
            report += `Action: ${crash.context.action}\n`;
            
            if (crash.breadcrumbs.length > 0) {
                report += '\nBreadcrumbs:\n';
                crash.breadcrumbs.forEach(b => report += `  ${b}\n`);
            }
            
            if (crash.stack) {
                report += `\nStack:\n${crash.stack}\n`;
            }
            
            report += '\n---\n\n';
        });

        return report;
    }

    // ✅ Clear crash history
    clearCrashes() {
        this.crashes = [];
        this.breadcrumbs = [];
        console.log('🧹 Crash history cleared');
    }

    // ✅ Get all crashes
    getAllCrashes(): CrashLog[] {
        return [...this.crashes];
    }

    private isEmulator(): boolean {
        if (Platform.OS === 'android') {
            return (
                Platform.constants?.Fingerprint?.includes('generic') ||
                Platform.constants?.Model?.includes('Emulator') ||
                false
            );
        }
        if (Platform.OS === 'ios') {
            // Use __DEV__ or check for simulator in systemName
            return Platform.constants?.systemName?.includes('Simulator') || __DEV__;
        }
        return false;
    }
}

// ✅ Export singleton instance
export const crashTracker = CrashTracker.getInstance();

// ✅ Convenience functions
export const trackBreadcrumb = (message: string) => {
    crashTracker.addBreadcrumb(message);
};

export const trackError = (
    type: CrashLog['type'],
    error: any,
    message?: string,
    state?: any
) => {
    crashTracker.logError(type, error, message, state);
};

export const setTrackingContext = (screen?: string, action?: string) => {
    crashTracker.setContext(screen, action);
};

export const getCrashReport = () => {
    return crashTracker.getCrashReport();
};

export const clearCrashHistory = () => {
    crashTracker.clearCrashes();
};