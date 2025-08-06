declare module 'lucide-react-native' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  interface IconProps extends ViewProps {
    size?: number;
    color?: string;
  }

  export const Download: ComponentType<IconProps>;
  // Add other icons as needed
}