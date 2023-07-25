import styled from 'styled-components/native';
import theme from './theme/theme';

export const FullPageView = styled.View<{ background?: string }>`
  max-width: 100%;
  flex: 1;
  ${({ background }) => (background ? 'background:' + background : '')}
`;

export const BaseText = styled.Text<{ color?: string }>`
  color: ${({ theme }) => theme.colors.white};
  includeFontPadding: false;
`;

export const FlexColumn = styled.View`
  display: flex;
  flex-direction: column;
`;
export const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
`;

export const Coin = styled.View<{ color?: string, size?: number }>`
  width: ${({ size }) => size ?? 30}px;
  height: ${({ size }) => size ?? 30}px;
  border: 3px solid ${({ color, theme }) => color ? color : theme.colors.gold};
  border-radius: ${({ size }) => (size ?? 30) / 2}px;
  background-color: ${theme.colors.background};
`;


export const GemImage = styled.Image<{ size?: number }>`
  width: ${({ size }) => size ?? 30}px;
  height: ${({ size }) => size ?? 30}px;
`;


export const ButtonText = styled(BaseText)<{fontSize?:number}>`
  color: ${theme.colors.white};
  font-size: ${({fontSize})=> fontSize ?? theme.fontSizes.h2}px;
  margin: auto;
`;


export const StyledButton = styled.TouchableOpacity`
  align-self: center;
  border: 3px solid rgba(255, 215, 0, 1);
  border-radius: 40px;
  height: 40px;
  width: 200px;
  background: ${theme.colors.darkBlue};
`;
