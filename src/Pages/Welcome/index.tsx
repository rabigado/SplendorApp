import React from 'react';
import { BaseText, FullPageView } from '../../shardStyles';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { deviceWidth } from '../../utils/dimensionHelper';
import theme, { colors } from '../../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../../Game';

const MainImageAsset = require('../../assets/images/Splendor-Board-Game.jpg.png');
export default () => {
  const { navigate } = useNavigation<StackNavigation>();
  return (
    <FullPageView background={colors.darkBlue}>
      <GoldBorderContainer
        colors={[theme.colors.lightGold, theme.colors.mediumBlue]}>
        <FlexCenterContainer>
          <StyledImage source={MainImageAsset} />
          <StyledButton onPress={() => navigate('Settings')}>
            <ButtonText>Start a new game</ButtonText>
          </StyledButton>
        </FlexCenterContainer>
      </GoldBorderContainer>
    </FullPageView>
  );
};

const FlexCenterContainer = styled.View`
  display: flex;
  flex: 1;
`;

const ButtonText = styled(BaseText)`
  color: ${theme.colors.white};
  font-size: ${theme.fontSizes.h2}px;
  margin: auto;
`;
const StyledButton = styled.TouchableOpacity`
  align-self: center;
  position: absolute;
  top: 50%;
  border: 3px solid rgba(255, 215, 0, 1);
  border-radius: 40px;
  height: 40px;
  width: 200px;
  background: ${theme.colors.darkBlue};
`;

const StyledImage = styled.Image`
  align-self: center;
  border-radius: 200px;
  height: 400px;
  width: ${deviceWidth * 0.85}px;
`;

const GoldBorderContainer = styled(LinearGradient)`
  border-radius: 175px;
  height: 410px;
  padding: 5px;
  overflow: hidden;
  margin: auto;
`;
