import NetInfo from "@react-native-community/netinfo";

export interface NetworkInfo {
    isConnected: Promise<boolean>;
}

export class NetworkInfoImpl implements NetworkInfo {
    get isConnected(): Promise<boolean> {
        return NetInfo.fetch().then(state => state.isConnected ?? false);
    }
}