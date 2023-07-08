import styled from 'styled-components/native';

export const StyledText = styled.Text<{isDarkMode?: boolean}>`
  color: ${({isDarkMode, theme}) =>
    isDarkMode ? theme.colors.white : theme.colors.black};
`;

export const SectionDescription = styled.Text`
  margin-top: 8px;
  font-size: 18px;
  font-weight: 400;
`;
export const FullPageView = styled.View<{background?: string}>`
  max-width: 100%;
  flex: 1;
  ${({background}) => (background ? 'background:' + background : '')}
`;

export const BaseText = styled.Text<{color?:string}>`
  color: ${({theme})=>theme.colors.white};
  includeFontPadding: false;
`;
