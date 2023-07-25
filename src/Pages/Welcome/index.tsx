import React from 'react';
import { ButtonText, FullPageView, StyledButton } from '../../shardStyles';
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
          <FloatingButton onPress={() => navigate('Settings')}>
            <ButtonText>Start a new game</ButtonText>
          </FloatingButton>
        </FlexCenterContainer>
      </GoldBorderContainer>
    </FullPageView>
  );
};

const FloatingButton = styled(StyledButton)`
  position: absolute;
  top: 50%;
`;

const FlexCenterContainer = styled.View`
  display: flex;
  flex: 1;
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
