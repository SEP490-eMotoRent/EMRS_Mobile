import React from "react";
import { StyleSheet, View } from "react-native";
import { StatusIcon } from "../../atoms/icons/StatusIcon";
import { InfoBullet } from "../../atoms/text/InfoBullet";

export const PaymentNotices: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.notice}>
                <StatusIcon type="info" />
                <InfoBullet text="Tiền cọc sẽ được trả về sau khi trả xe" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    notice: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
});
