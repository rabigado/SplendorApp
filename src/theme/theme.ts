import {calcFontSize} from '../utils/dimensionHelper';
import {IColors} from './styled';
import {Modal, TextField, DefaultTheme} from 'styled-components/native';

export const colors: IColors = {
  white: 'white',
  lightWhite: 'rgba(255,255,255,.4)',
  black: 'rgba(0,0,0,0.63)',
  accent: {
    red60: '#FF6666',
    purple: '#EEE5FE',
    yellow: '#FDF2DA',
    lightBlue: '#E5F8FF',
    olive: '#AD9B87',
    background: '#F3F0EC',
    red: '#FC0505',
    green: '#4AC4AE',
    lightGreen: '#D1E7E0',
    grass: '#207048',
    lightBrown: '#C8C0B5',
  },
  system: {
    error: '#FC0505',
    approvedCardBackground: '#DBEAE4',
    black: '#000000',
    grey: '#717171',
    lightGrey: '#F2F2F3',
    lightGrey2: '#C7C0B6',
    darkGrey: '#515160',
    avatarBlack: '#43413E',
    progressBar: '#F2F2F3',
    CardActions: 'rgba(255, 255, 255, 0.7)',
    headerBorder: 'rgba(0, 0, 0, 0.1)',
    border: 'rgba(0, 0, 0, 0.1)',
    popUpHeaderBorder: 'rgba(0, 0, 0, 0.25)',
    orange: '#FE9345',
    orangeLight: 'rgba(254, 147, 69, 0.2)',
    redLight: 'rgba(255, 102, 102, 0.2)',
    red: '#FF6666',
    green: '#4AC4AE',
    greenLight: 'rgba(74, 196, 174, 0.2)',
  },
  darkBlue: 'rgba(26, 46, 109, 1)',
  mediumBlue: '#012231',
  lightBlue: '#013349',
  lightText: '#E5E5E5',
  secondaryProminentText: '#01162D',
  gentleText: '#AD9B87',
  secondaryGentleText: '#515160',
  transparent: 'transparent',
  subHeader: '#57586E',
  background: '#F3F0EC',

  imagePlaceHolder: '#C4C4C4',
  tagText: '#515160',
  ctaButton: '#D1715B',
  secondaryBackground: '#F3F0EC',
  separator: '#d9dbe9',
  loader: '#D1715B',
  gold: 'rgba(255, 215, 0, 0.4)',
  lightGold: 'rgba(255, 195, 0, 1)',
  mediumGold: 'rgba(255, 215, 0, 1)'
};

export const fontSizes = {
  h1: calcFontSize(26),
  h2: calcFontSize(24),
  h3: calcFontSize(22),
  h4: calcFontSize(20),
  body1: calcFontSize(16),
  body2: calcFontSize(14),
  caption1: calcFontSize(12),
  caption2: calcFontSize(11),
  s28: calcFontSize(28),
};

export const spacing = {
  small: 12,
  medium: 16,
  normal: 24,
  large: 32,
  extraLarge: 48,
};

export const fontStyles = {
  normal: 'normal',
};

export const opacity = {
  disabled: 0.5,
  default: 1,
};

export const textField: TextField = {
  backgroundColors: {
    normal: colors.lightText,
    error: '#FFF4F2',
    disabled: '#C9C9C9',
  },
  color: colors.lightText,
  border: {
    validInput: '1px solid #C8C0B5',
    invalidInput: `2px solid ${colors.system.lightGrey}`,
    focused: '2px solid #14142B',
  },
  title: {
    fontSize: fontSizes.caption1,
    fontStyle: fontStyles.normal,
    fontWeight: '400',
    color: colors.lightText,
    colorError: colors.system.error,
    colorDisabled: colors.system.grey,
  },
  dimensions: {
    singleLineHeight: 44,
    multilineHeight: 193,
    minHeight: 44,
  },
};

export const modal: Modal = {
  container: {
    flexEnd: `flex: 1;
    justify-content: flex-end;`,
    padding: '24px 24px 30%',
    backgroundColor: colors.background,
  },
  title: {
    paddingTop: '40px',
    fontWeight: 500,
    fontSize: fontSizes.h1,
    color: colors.system.black,
  },
  text: {
    marginTop: '16px',
    fontSize: fontSizes.h3,
    color: colors.tagText,
  },
  button: {
    background: colors.ctaButton,
    padding: '14px',
    flexCenter: 'align-items: center',
    marginTop: '24px',
    borderRadius: '6px',
    text: {
      fontStyle: fontStyles.normal,
      fontWeight: 'bold',
      fontSize: fontSizes.body1,
      color: colors.lightText,
    },
  },
};

export const skeletonCard = {
  backgroundColor: colors.lightText,
  boneColor: '#E1E9EE',
};

export const Components = {
  textField,
  modal,
  skeletonCard,
};

const theme: DefaultTheme = {
  colors,
  fontSizes,
  fontStyles,
  spacing,
  opacity,
  Components,
};

export default theme;
