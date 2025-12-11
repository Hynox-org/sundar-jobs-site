/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Palette = {
  background: '#EDF2F4', // backgrounds, cards, neutral surfaces
  primary: '#EF233C',    // primary buttons, CTAs, key interactive elements
  secondary: '#FBB13C',   // secondary actions, highlights, hover states
  accent: '#8D80AD',     // accent elements, badges, supporting UI components
  text: '#000000',       // text, borders, strong emphasis
};

export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.background,
    tint: Palette.primary,
    icon: Palette.accent, // Using accent for general icons
    tabIconDefault: Palette.text, // Default tab icon color
    tabIconSelected: Palette.primary, // Selected tab icon color
    secondaryText: '#6c757d', // A softer text color for secondary information
    cardBackground: '#ffffff', // Background for cards and elevated surfaces
    border: '#e0e0e0', // Border color for separators and outlines
    secondary: Palette.secondary, // Add secondary color from Palette
  },
  dark: {
    // For dark mode, we might want to adjust these or define a separate dark palette if needed.
    // For now, I'll use the same palette but invert text/background if it makes sense.
    // Given the palette is mostly light, I'll keep it consistent for now.
    text: Palette.text,
    background: Palette.background,
    tint: Palette.primary,
    icon: Palette.accent,
    tabIconDefault: Palette.text,
    tabIconSelected: Palette.primary,
    secondaryText: '#a0a0a0', // A softer text color for secondary information in dark mode
    cardBackground: '#1e1e1e', // Background for cards and elevated surfaces in dark mode
    border: '#3a3a3a', // Border color for separators and outlines in dark mode
    secondary: Palette.secondary, // Add secondary color from Palette
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});