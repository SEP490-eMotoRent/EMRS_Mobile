// import { RouteProp, useRoute } from '@react-navigation/native';
// import React, { useEffect } from 'react';
// import { ActivityIndicator, Text, View } from 'react-native';
// import { BookingStackParamList } from '../../../../../shared/navigation/StackParameters/types';
// import { useVNPayDeepLink } from '../../../hooks/useVNPayDeepLink';

// type RoutePropType = RouteProp<BookingStackParamList, 'VNPayCallback'>;

// export const VNPayCallbackScreen: React.FC = () => {
//     const route = useRoute<RoutePropType>();
//     const { vnp_ResponseCode, vnp_TxnRef } = route.params;

//     // Trigger deep link handler
//     useVNPayDeepLink();

//     useEffect(() => {
//         console.log('VNPayCallbackScreen - Params:', { vnp_ResponseCode, vnp_TxnRef });
//     }, [vnp_ResponseCode, vnp_TxnRef]);

//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
//         <ActivityIndicator size="large" color="#4169E1" />
//         <Text style={{ color: '#fff', marginTop: 16 }}>Đang xử lý thanh toán...</Text>
//         </View>
//     );
// };

//THIS FILE HAS BEEN DECOMMISSIONED