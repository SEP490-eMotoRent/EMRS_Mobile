import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ReviewCard } from '../../molecules/cards/ReviewCard';

export const ReviewsSection: React.FC = () => {
    const reviews = [
        {
        title: "Hoàn hảo cho đi lại trong thành phố",
        content: "Thuê xe máy điện từ eMotoRent cho việc đi lại hàng ngày và thật tuyệt vời! Quy trình đặt xe mượt mà, xe được giao tận cửa. Rất khuyến khích cho bất kỳ ai tìm kiếm phương tiện thân thiện với môi trường!",
        author: "Sarah L.",
        rating: 5,
        },
        {
        title: "Trải nghiệm tuyệt vời",
        content: "Tính linh hoạt của eMotoRent là vô song. Tôi cần xe cho chuyến đi cuối tuần, gói tuần này sang tuần khác rất phù hợp. Không cam kết dài hạn, không rắc rối. Xe bảo trì tốt và vui khi lái!",
        author: "Michael T.",
        rating: 5,
        },
        {
        title: "Dịch vụ thuê xe tốt nhất",
        content: "Tôi đã thử nhiều dịch vụ thuê xe, nhưng eMotoRent nổi bật. Dịch vụ khách hàng xuất sắc, xe luôn trong tình trạng tốt, giá minh bạch. Chắc chắn sẽ sử dụng lại!",
        author: "Jennifer R.",
        rating: 5,
        },
    ];

    return (
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đánh giá</Text>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
            ))}
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    scrollContent: {
        paddingRight: 16,
    },
});