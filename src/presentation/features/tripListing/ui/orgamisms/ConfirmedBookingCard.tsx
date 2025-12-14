// import React from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { StatusBadge } from "../atoms/badges/StatusBadge";
// import { BookingReference } from "../atoms/text/BookingReference";
// import { VehicleInfo } from "../molecules/VehicleInfo";

// export interface ConfirmedBooking {
//     id: string;
//     vehicleName: string;
//     dates: string;
//     startsIn: string;
//     reference: string;
//     totalAmount: string;
// }

// interface ConfirmedBookingCardProps {
//     booking: ConfirmedBooking;
//     onViewDetails: () => void;
//     onCancel: () => void;
// }

// export const ConfirmedBookingCard: React.FC<ConfirmedBookingCardProps> = ({
//     booking,
//     onViewDetails,
//     onCancel,
// }) => {
//     return (
//         <View style={styles.card}>
//             <StatusBadge status="confirmed" />
            
//             <View style={styles.content}>
//                 <VehicleInfo name={booking.vehicleName} dates={booking.dates} />
                
//                 <View style={styles.info}>
//                     <Text style={styles.startsIcon}>📅</Text>
//                     <Text style={styles.startsText}>{booking.startsIn}</Text>
//                 </View>
                
//                 <BookingReference reference={booking.reference} />
                
//                 <View style={styles.row}>
//                     <Text style={styles.label}>Tổng số tiền</Text>
//                     <Text style={styles.amount}>{booking.totalAmount}</Text>
//                 </View>
                
//                 <View style={styles.actions}>
//                     <TouchableOpacity style={styles.primaryButton} onPress={onViewDetails}>
//                         <Text style={styles.primaryButtonText}>Chi Tiết</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
//                         <Text style={styles.cancelButtonText}>Hủy</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     card: {
//         backgroundColor: "#1a1a1a",
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//     },
//     content: {
//         marginTop: 12,
//     },
//     info: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 6,
//         marginTop: 8,
//     },
//     startsIcon: {
//         fontSize: 12,
//     },
//     startsText: {
//         color: "#999",
//         fontSize: 12,
//     },
//     row: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginTop: 12,
//         paddingTop: 12,
//         borderTopWidth: 1,
//         borderTopColor: "#333",
//     },
//     label: {
//         color: "#999",
//         fontSize: 14,
//     },
//     amount: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "700",
//     },
//     actions: {
//         flexDirection: "row",
//         gap: 12,
//         marginTop: 12,
//     },
//     primaryButton: {
//         flex: 1,
//         backgroundColor: "#d4c5f9",
//         paddingVertical: 12,
//         borderRadius: 12,
//         alignItems: "center",
//     },
//     primaryButtonText: {
//         color: "#000",
//         fontSize: 14,
//         fontWeight: "600",
//     },
//     cancelButton: {
//         paddingHorizontal: 24,
//         paddingVertical: 12,
//     },
//     cancelButtonText: {
//         color: "#ef4444",
//         fontSize: 14,
//         fontWeight: "600",
//     },
// });