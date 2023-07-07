import React from 'react';
import {Button, Text, View} from 'react-native';
import {FullPageView} from '../../shardStyles';
import styled from 'styled-components/native';
// import {LinearGradient} from 'expo-linear-gradient';

const MainImageAsset = require('../../assets/images/Splendour-image.png');
export default () => {
  return (
    <FullPageView>
      <Text style={{fontSize: 24}}>Welcome to splendor</Text>
      <View>
        {/*<StyledLinarGradiant colors={['#4c669f', '#3b5998', '#192f6a']}>*/}
        <StyledImage source={MainImageAsset} />
        {/*</StyledLinarGradiant>*/}
        <Button
          title={'Start a new game'}
          onPress={() => console.log('press')}
        />
      </View>
    </FullPageView>
  );
};

const StyledImage = styled.Image`
  align-self: center;
  height: 75%;
  width: 70%;
`;

// const StyledLinarGradiant = styled(LinearGradient)`
//   padding: 15px;
//   align-items: center;
//   border-radius: 5px;
// `;
