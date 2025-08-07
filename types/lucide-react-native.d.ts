declare module 'lucide-react-native' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  interface IconProps extends ViewProps {
    size?: number;
    color?: string;
  }

  export const Download: ComponentType<IconProps>;
  export const ChevronLeft: ComponentType<IconProps>;
  export const ChevronRight: ComponentType<IconProps>;
  export const Plus: ComponentType<IconProps>;
  export const Home: ComponentType<IconProps>;
  export const Calendar: ComponentType<IconProps>;
  export const Clock: ComponentType<IconProps>;
  export const CheckCircle: ComponentType<IconProps>;
  export const Settings2: ComponentType<IconProps>;
  export const CreditCard: ComponentType<IconProps>;
  export const DollarSign: ComponentType<IconProps>;
  export const ExternalLink: ComponentType<IconProps>;
  export const X: ComponentType<IconProps>;
  export const Upload: ComponentType<IconProps>;
  // Add other icons as needed
}