import styled from 'styled-components/native';
import React from 'react';
import { ImageSourcePropType } from 'react-native';

export default  ({imageUrl,size}:{imageUrl:ImageSourcePropType, size?: number})=>{
  return <AvatarContainer size={size}>
    <PlayerImage
      resizeMethod={'resize'}
      source={imageUrl}
    />
  </AvatarContainer>;
};


const PlayerImage = styled.Image`
  width: 100%;
  height: 100%;

`;


const AvatarContainer = styled.View<{size?:number}>`
  overflow: hidden;
  width: ${({size})=>size ?? 60}px;
  height: ${({size})=>size ?? 60}px;
  border-color: ${({theme})=> theme.colors.lightGold};
  border-width: 2px;
  border-radius: ${({size})=>size ? (size / 2) : 30}px;
`;
