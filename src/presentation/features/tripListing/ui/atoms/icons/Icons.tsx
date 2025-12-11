import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';

type IconFamily = 'ionicons' | 'material' | 'fontawesome5' | 'feather';

interface VectorIcon {
  family: IconFamily;
  name: string;
}

const vectorIcons: Record<string, VectorIcon> = {
  // Navigation
  back: { family: 'ionicons', name: 'chevron-back' },
  forward: { family: 'ionicons', name: 'chevron-forward' },
  close: { family: 'ionicons', name: 'close' },
  menu: { family: 'ionicons', name: 'menu' },
  
  // Actions
  search: { family: 'ionicons', name: 'search' },
  filter: { family: 'ionicons', name: 'filter' },
  edit: { family: 'ionicons', name: 'pencil' },
  delete: { family: 'ionicons', name: 'trash' },
  add: { family: 'ionicons', name: 'add' },
  remove: { family: 'ionicons', name: 'remove' },
  checkmark: { family: 'ionicons', name: 'checkmark' },
  refresh: { family: 'ionicons', name: 'refresh' },
  reload: { family: 'ionicons', name: 'reload-outline' },
  
  // Status
  warning: { family: 'ionicons', name: 'warning' },
  info: { family: 'ionicons', name: 'information-circle' },
  success: { family: 'ionicons', name: 'checkmark-circle' },
  error: { family: 'ionicons', name: 'close-circle' },
  
  // User & Profile
  person: { family: 'ionicons', name: 'person' },
  profile: { family: 'ionicons', name: 'person-circle' },
  logout: { family: 'ionicons', name: 'log-out' },
  settings: { family: 'ionicons', name: 'settings' },
  
  // Documents & Files
  document: { family: 'ionicons', name: 'document-text' },
  camera: { family: 'ionicons', name: 'camera' },
  image: { family: 'ionicons', name: 'image' },
  images: { family: 'ionicons', name: 'images' },
  
  // Location & Map
  location: { family: 'ionicons', name: 'location' },
  pin: { family: 'ionicons', name: 'location-sharp' },
  map: { family: 'ionicons', name: 'map' },
  navigate: { family: 'ionicons', name: 'navigate' },
  
  // Time & Calendar
  calendar: { family: 'ionicons', name: 'calendar' },
  time: { family: 'ionicons', name: 'time' },
  clock: { family: 'ionicons', name: 'time-outline' },
  
  // Vehicle Related
  battery: { family: 'ionicons', name: 'battery-charging-outline' },
  flash: { family: 'ionicons', name: 'flash' },
  vehicle: { family: 'ionicons', name: 'bicycle' },
  motorcycle: { family: 'ionicons', name: 'bicycle' },
  
  // Payment & Wallet
  wallet: { family: 'ionicons', name: 'wallet' },
  card: { family: 'ionicons', name: 'card' },
  cash: { family: 'ionicons', name: 'cash' },
  
  // Communication
  notification: { family: 'ionicons', name: 'notifications' },
  mail: { family: 'ionicons', name: 'mail' },
  call: { family: 'ionicons', name: 'call' },
  
  // UI Elements
  eye: { family: 'ionicons', name: 'eye' },
  eyeOff: { family: 'ionicons', name: 'eye-off' },
  star: { family: 'ionicons', name: 'star' },
  starOutline: { family: 'ionicons', name: 'star-outline' },
  heart: { family: 'ionicons', name: 'heart' },
  heartOutline: { family: 'ionicons', name: 'heart-outline' },
  
  // Arrows & Chevrons
  arrowUp: { family: 'ionicons', name: 'arrow-up' },
  arrowDown: { family: 'ionicons', name: 'arrow-down' },
  arrowLeft: { family: 'ionicons', name: 'arrow-back' },
  arrowRight: { family: 'ionicons', name: 'arrow-forward' },
  chevronUp: { family: 'ionicons', name: 'chevron-up' },
  chevronDown: { family: 'ionicons', name: 'chevron-down' },
  
  // More
  more: { family: 'ionicons', name: 'ellipsis-horizontal' },
  moreVertical: { family: 'ionicons', name: 'ellipsis-vertical' },
  
  // Home & Tabs
  home: { family: 'ionicons', name: 'home' },
  browse: { family: 'ionicons', name: 'grid' },
  bookings: { family: 'ionicons', name: 'calendar' },
  account: { family: 'ionicons', name: 'person' },
};

interface IconProps {
  name: keyof typeof vectorIcons;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#fff' }) => {
  const icon = vectorIcons[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  switch (icon.family) {
    case 'ionicons':
      return <Ionicons name={icon.name as any} size={size} color={color} />;
    case 'material':
      return <MaterialIcons name={icon.name as any} size={size} color={color} />;
    case 'fontawesome5':
      return <FontAwesome5 name={icon.name as any} size={size} color={color} />;
    case 'feather':
      return <Feather name={icon.name as any} size={size} color={color} />;
    default:
      return null;
  }
};