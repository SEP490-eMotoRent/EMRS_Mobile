import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../../shared/navigation/AuthNavigator';
import { HorizontalSlideshow } from '../molecules/HorizontalSlideshow';
import { BrandHeader } from '../molecules/BrandHeader';
import { AuthButtonGroup } from '../molecules/AuthButtonGroup';
import { AppColors } from '../../../../common/constants/AppColor';


const onboarding1 = require('../../../../../../assets/images/onboarding1.png');
const onboarding2 = require('../../../../../../assets/images/onboarding2.png');
const onboarding3 = require('../../../../../../assets/images/onboarding3.png');
const onboarding4 = require('../../../../../../assets/images/onboarding4.png');

interface HelloBodyProps {
    navigation: NativeStackNavigationProp<AuthStackParamList>;
}

export const HelloBody: React.FC<HelloBodyProps> = ({ navigation }) => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;

    const slideshowHeight = screenHeight * 0.25;
    const imageWidth = screenWidth * 0.92;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.spacerTop} />
                <HorizontalSlideshow
                    height={slideshowHeight}
                    imageWidth={imageWidth}
                    images={[onboarding1, onboarding2, onboarding3, onboarding4]}
                    direction="left"
                    speed={40}
                />
                <View style={styles.spacerSmall} />
                <HorizontalSlideshow
                    height={slideshowHeight}
                    imageWidth={imageWidth}
                    images={[onboarding1, onboarding2, onboarding3, onboarding4]}
                    direction="right"
                    speed={35}
                />
                <View style={styles.spacerMedium} />
                <BrandHeader />
                <View style={styles.spacer} />
                <AuthButtonGroup navigation={navigation} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: AppColors.black,
    },
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    spacerTop: {
        height: 20,
    },
    spacerSmall: {
        height: 12,
    },
    spacerMedium: {
        height: 24,
    },
    spacer: {
        flex: 1,
    },
});