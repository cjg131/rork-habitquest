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
  // Add other icons as needed
}