export interface Transaction {
  title: string;
  date: string;
  amount: number;
}

export interface Verification {
  label: string;
  status: 'verified' | 'valid' | 'needed';
  validUntil?: string;
}

export type BadgeType = 'error' | 'warning' | 'success';
export type IconName = 'edit' | 'wallet' | 'minus' | 'plus' | 'arrow' | 'check' | 'cross' | 
  'bell' | 'card' | 'location' | 'language' | 'gift' | 'document' | 'help' | 'terms' | 'logout' | 'shield';
