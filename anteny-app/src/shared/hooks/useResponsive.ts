import { useState, useEffect } from 'react';
import { Platform, Dimensions } from 'react-native';

const WIDE_BREAKPOINT = 768;

interface ResponsiveInfo {
  isWide: boolean;
  isWeb: boolean;
  width: number;
  height: number;
}

export function useResponsive(): ResponsiveInfo {
  const isWeb = Platform.OS === 'web';

  const [dims, setDims] = useState(() => {
    if (!isWeb) {
      return { width: 0, height: 0 };
    }
    const win = Dimensions.get('window');
    return { width: win.width, height: win.height };
  });

  useEffect(() => {
    if (!isWeb) return;

    const handler = ({ window }: { window: { width: number; height: number } }) => {
      setDims({ width: window.width, height: window.height });
    };

    const subscription = Dimensions.addEventListener('change', handler);

    // Initial read
    const win = Dimensions.get('window');
    setDims({ width: win.width, height: win.height });

    return () => subscription.remove();
  }, [isWeb]);

  return {
    isWide: isWeb && dims.width >= WIDE_BREAKPOINT,
    isWeb,
    width: dims.width,
    height: dims.height,
  };
}
