import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { AntDesign } from '@expo/vector-icons';
import { TextLabel } from '../atoms/navigationBarIcons/TextLabel';

export type StaffNavRoute = 'home' | 'handover' | 'profile' | 'scanface' | 'charging';

interface StaffBottomNavigationBarProps {
  activeRoute: StaffNavRoute;
  onNavigate: (route: StaffNavRoute) => void;
}

export const StaffBottomNavigationBar: React.FC<StaffBottomNavigationBarProps> = ({
  activeRoute,
  onNavigate,
}) => {
  const navItems = [
    {
      route: 'home' as StaffNavRoute,
      icon: 'home',
      label: 'Home',
    },
    {
      route: 'charging' as StaffNavRoute,
      icon: 'thunderbolt',
      label: 'Charging',
    },
    {
      route: 'scanface' as StaffNavRoute,
      icon: 'scan',
      label: 'Scan Face',
      isCenter: true,
    },
    {
      route: 'handover' as StaffNavRoute,
      icon: 'car',
      label: 'Handover',
    },
    {
      route: 'profile' as StaffNavRoute,
      icon: 'user',
      label: 'Profile',
    }
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item, index) => (
        <TouchableOpacity
          key={item.route}
          style={[
            styles.navItem,
            item.isCenter && styles.centerNavItem,
          ]}
          onPress={() => onNavigate(item.route)}
          activeOpacity={0.7}
        >
          {item.isCenter ? (
            <View style={styles.centerButtonContainer}>
              <View style={[
                styles.centerButton,
                activeRoute === item.route && styles.centerButtonActive
              ]}>
                <AntDesign
                  name={item.icon as any}
                  size={28}
                  color={activeRoute === item.route ? '#FFFFFF' : '#FFFFFF'}
                />
              </View>
            </View>
          ) : (
            <>
              <AntDesign
                name={item.icon as any}
                size={24}
                color={activeRoute === item.route ? '#C9B6FF' : colors.text.secondary}
              />
              <View
                style={[
                  styles.labelContainer,
                  activeRoute === item.route && styles.activeLabelContainer,
                ]}
              >
                <View
                  style={[
                    styles.labelBackground,
                    activeRoute === item.route && styles.activeLabelBackground,
                  ]}
                />
                <TextLabel
                  color={activeRoute === item.route ? '#C9B6FF' : colors.text.secondary}
                  fontSize={10}
                  fontWeight={activeRoute === item.route ? '600' : '400'}
                >
                  {item.label}
                </TextLabel>
              </View>
            </>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
    position: 'relative',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  centerNavItem: {
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  centerButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#C9B6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -100, // Elevate above the nav bar
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: colors.background,
  },
  centerButtonActive: {
    backgroundColor: '#9C27B0',
    transform: [{ scale: 1.1 }],
  },
  labelContainer: {
    marginTop: 4,
    position: 'relative',
  },
  activeLabelContainer: {
    // Active state styling
  },
  labelBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  activeLabelBackground: {
    backgroundColor: '#C9B6FF',
    opacity: 0.2,
  },
  label: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    textAlign: 'center',
  },
  activeLabel: {
    color: '#C9B6FF',
    fontWeight: '600',
  },
});
