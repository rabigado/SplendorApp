// and extend it
import 'styled-components';
import {SkeletonCard} from 'styled-components';

export interface IColors {
  white: string;
  lightWhite: string;
  black: string;
  accent: {
    red60: string;
    purple: string;
    yellow: string;
    lightBlue: string;
    olive: string;
    background: string;
    red: string;
    green: string;
    lightGreen: string;
    grass: string;
    lightBrown: string;
  };
  system: {
    error: string;
    approvedCardBackground: string;
    black: string;
    grey: string;
    darkGrey: string;
    lightGrey: string;
    lightGrey2: string;
    avatarBlack: string;
    progressBar: string;
    CardActions: string;
    headerBorder: string;
    border: string;
    popUpHeaderBorder: string;
    orange: string;
    orangeLight: string;
    red: string;
    redLight: string;
    green: string;
    greenLight: string;
  };
  secondaryProminentText: string;
  lightText: string;
  darkBlue: string;
  mediumBlue: string;
  lightBlue: string;
  gentleText: string;
  secondaryGentleText: string;
  transparent: string;
  subHeader: string;
  background: string;
  imagePlaceHolder: string;
  tagText: string;
  ctaButton: string;
  secondaryBackground: string;
  separator: string;
  loader: string;
  gold: string,
  lightGold: string,
  mediumGold: string
}

declare module 'styled-components/native' {
  export interface TextField {
    backgroundColors: {
      normal: string;
      error: string;
      disabled: string;
    };
    color: string;
    border: {
      validInput: string;
      invalidInput: string;
      focused: string;
    };
    title: {
      fontSize: FontSizes;
      fontStyle: FontStyles;
      fontWeight: string;
      color: string;
      colorError: string;
      colorDisabled: string;
    };
    dimensions: {
      singleLineHeight: number;
      multilineHeight: number;
      minHeight: number;
    };
  }

  export interface Modal {
    container: {
      flexEnd: string;
      padding: string;
      backgroundColor: string;
    };
    title: {
      paddingTop: string;
      fontWeight: number;
      fontSize: FontSize;
      color: string;
    };
    text: {
      marginTop: string;
      fontSize: FontSize;
      color: string;
    };
    button: {
      background: string;
      padding: string;
      flexCenter: string;
      marginTop: string;
      borderRadius: string;
      text: {
        fontStyle: string;
        fontWeight: string;
        fontSize: FontSize;
        color: string;
      };
    };
  }

  export interface DefaultTheme {
    colors: IColors;

    fontSizes: {
      h1: number;
      h2: number;
      h3: number;
      h4: number;
      body1: number;
      body2: number;
      caption1: number;
      caption2: number;
      s28: number;
    };

    fontStyles: {
      normal: string;
    };

    spacing: {
      small: number;
      medium: number;
      normal: number;
      large: number;
      extraLarge: number;
    };

    opacity: {
      disabled: number;
      default: number;
    };

    Components: {
      textField: TextField;
      modal: Modal;
      skeletonCard: SkeletonCard;
    };
  }
}
