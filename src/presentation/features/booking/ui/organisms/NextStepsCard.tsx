import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NextStepItem } from "../molecules/phase4/NextStepItem";

export const NextStepsCard: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Các bước tiếp theo</Text>
            <NextStepItem
                number={1}
                title="Hợp đồng đã sẵn sàng để ký điện tử"
                description="Bạn nên xem xét kỹ hợp đồng trước khi ký"
            />
            <NextStepItem
                number={2}
                title="Bạn sẽ nhận được mã OTP để hoàn tất ký"
                description="Mã OTP sẽ được gửi đến số điện thoại bạn sử dụng để đăng kí"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16,
    },
});