//This Screen is replaced by HelloScreen.tsx




// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { AuthStackParamList } from '../../../../shared/navigation/AuthNavigator';
// import { colors } from '../../../../common/theme/colors';
// import Button from 'react-native/types_generated/Libraries/Components/Button';


// const { width, height } = Dimensions.get('window');
// const onboarding1 = require('../../../../../assets/images/onboarding1.png');
// const onboarding2 = require('../../../../../assets/images/onboarding2.png');

// type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

// export const OnboardingScreen: React.FC = () => {
//   const navigation = useNavigation<OnboardingScreenNavigationProp>();

//   const handleSignUp = () => {
//     navigation.navigate('Register');
//   };

//   const handleSignIn = () => {
//     navigation.navigate('Login');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.statusBar}>
//         <Text style={styles.timeText}>12:00</Text>
//       </View>

//       <View style={styles.imagesContainer}>
//         <View style={styles.upperImageContainer}>
//           <Image source={onboarding1} resizeMode="cover" />
//         </View>

//         <View style={styles.lowerImageContainer}>
//           <Image source={onboarding2} resizeMode="cover" />
//         </View>
//       </View>

//       <View style={styles.bottomSection}>
//         <Text style={styles.appTitle}>eMotoRent</Text>
        
//         <Text style={styles.tagline}>Your Rental EBike. Unlocked</Text>

//         <Button
//           title="Sign Up"
//           onPress={handleSignUp}
//           variant="primary"
//           style={[styles.button, styles.signUpButton]}
//         />

//         <Button
//           title="Sign In"
//           onPress={handleSignIn}
//           variant="outline"
//           style={[styles.button, styles.signInButton]}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   statusBar: {
//     paddingTop: 10,
//     paddingLeft: 20,
//   },
//   timeText: {
//     color: colors.text.primary,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   imagesContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   upperImageContainer: {
//     flex: 1,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   lowerImageContainer: {
//     flex: 1,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     width: width * 0.9,
//     height: 200,
//     borderRadius: 20,
//   },
//   motorcyclePlaceholder1: {
//     width: width * 0.8,
//     height: 200,
//     backgroundColor: '#1a1a1a',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   motorcyclePlaceholder2: {
//     width: width * 0.8,
//     height: 200,
//     backgroundColor: '#2a2a2a',
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   motorcycle1: {
//     width: 120,
//     height: 80,
//     position: 'relative',
//   },
//   motorcycle2: {
//     width: 120,
//     height: 80,
//     position: 'relative',
//   },
//   motorcycleBody1: {
//     width: 120,
//     height: 60,
//     backgroundColor: '#333333',
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#444444',
//   },
//   motorcycleBody2: {
//     width: 120,
//     height: 60,
//     backgroundColor: '#cccccc',
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#aaaaaa',
//   },
//   redTailLight: {
//     position: 'absolute',
//     right: -8,
//     top: 20,
//     width: 16,
//     height: 8,
//     backgroundColor: '#ff0000',
//     borderRadius: 4,
//   },
//   ledStrip: {
//     position: 'absolute',
//     top: -5,
//     left: 10,
//     right: 10,
//     height: 4,
//     backgroundColor: '#00ff00',
//     borderRadius: 2,
//   },
//   greenWheelAccent: {
//     position: 'absolute',
//     bottom: 5,
//     left: 20,
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: '#ffff00',
//     borderWidth: 2,
//     borderColor: '#00ff00',
//   },
//   bottomSection: {
//     paddingHorizontal: 24,
//     paddingBottom: 40,
//     paddingTop: 20,
//   },
//   appTitle: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: colors.text.primary,
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   tagline: {
//     fontSize: 18,
//     color: colors.text.primary,
//     textAlign: 'center',
//     marginBottom: 40,
//     fontWeight: '400',
//   },
//   button: {
//     marginVertical: 8,
//     height: 56,
//   },
//   signUpButton: {
//     backgroundColor: '#4285F4',
//   },
//   signInButton: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: colors.button.border,
//   },
// });
