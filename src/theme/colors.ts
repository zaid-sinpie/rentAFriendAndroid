export interface ColorPalette {
  background: string;
  card: string;
  surface: string;
  surfaceSubtle: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSubtle: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  white: string;
  black: string;
  overlay: string;
}

export const lightColors: ColorPalette = {
  background: '#F8F7F4',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSubtle: '#F0EEE9',
  primary: '#E8A27C',
  primaryLight: '#F5CEB8',
  primaryDark: '#C97E56',
  text: '#292A2D',
  textSecondary: '#73757C',
  textMuted: '#9B9DA4',
  border: '#E8E5DF',
  borderSubtle: '#EFECE7',
  success: '#398568',
  successLight: '#E8F3EE',
  warning: '#C48A39',
  warningLight: '#FDF4E7',
  error: '#C64D4D',
  errorLight: '#FBEBEB',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(20, 21, 24, 0.45)',
};

export const darkColors: ColorPalette = {
  background: '#202126',
  card: '#292B32',
  surface: '#292B32',
  surfaceSubtle: '#30323A',
  primary: '#F0B08B',
  primaryLight: '#F9D1BA',
  primaryDark: '#D48A5E',
  text: '#F4F1EC',
  textSecondary: '#A5A6AD',
  textMuted: '#7A7C85',
  border: '#3A3C45',
  borderSubtle: '#33353E',
  success: '#4EAA86',
  successLight: '#1E362C',
  warning: '#DCA452',
  warningLight: '#3D301C',
  error: '#E06A6A',
  errorLight: '#3D2020',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.65)',
};
