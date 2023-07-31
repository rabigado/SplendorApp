import styled from 'styled-components/native';
import React, { useContext, useState } from 'react';
import { GameContext } from '../../context/context';
import { View } from 'react-native';
import { isUndefined, keys, map, sum } from 'lodash';
import { BaseText, FlexColumn, FlexRow, GemImage, StyledButton } from '../../shardStyles';
import { GemsIcons, GemType } from '../../Entities/Gem';
import CardsCarouselModal from '../CardsCarouselModal';

const background = require('../../assets/images/oldRexture.jpeg');

const PlayerSingleResourceView = ({ gemValue, cardValue, imageIndex }: {
  gemValue: number,
  cardValue: number,
  imageIndex: string | number
}) => {
  return <View>
    <CountContainer>
      <View>
        <GemImage
          size={15}
          source={GemsIcons[Number(imageIndex)]}
          resizeMethod={'resize'} />

      </View>
      <CoinValue>
        <BaseText>
          {gemValue}
        </BaseText>
      </CoinValue>
      <PrestigeValue>
        <BaseText>
          {cardValue}
        </BaseText>
      </PrestigeValue>
    </CountContainer>
  </View>;
};

export default ({playerId}:{playerId?:number}) => {
  const { game: { currentPlayerId, players } } = useContext(GameContext);
  const [showReserved,setShowReserved] = useState(false);
  const [showOwned,setShowOwned] = useState(false);
  const player = playerId ? players.find(p=>p.id === playerId) : (currentPlayerId !== -1 ? players[currentPlayerId] : null);

  return <PlayerData>
    <StyledImageBackground source={background} resizeMode="stretch" style={{ flex: 1 }}>
      <StyledRow>
        <CountContainer>
          {/*TODO: text should be more visible*/}
          <View><BaseText>Gem</BaseText></View>
          <CoinValue>
            <BaseText>
              Coins ({sum(map(player?.playerGems, (key) => key.length)) + (player?.gold ?? 0)}/10)
            </BaseText>
          </CoinValue>
          <PrestigeValue>
            <BaseText>Prestige</BaseText>
          </PrestigeValue>
        </CountContainer>
        {keys(player?.playerGems).map((key) => {
          let gemTypeElement: Partial<GemType> = GemType[key as keyof typeof GemType];
          return <PlayerSingleResourceView
            cardValue={sum(player?.cards.map(card => card.gemValue?.imageIndex === Number(key) ? 1 : 0))}
            /*@ts-ignore TODO*/
            gemValue={player?.playerGems[GemType[gemTypeElement]]?.length}
            imageIndex={key}
            key={`view-${key}`} />;
        })}
        <PlayerSingleResourceView imageIndex={0}
                                  cardValue={0}
                                  gemValue={player?.gold ?? 0}
        />
        {isUndefined(playerId) ? <FlexColumn>
          <ShowDeckButton disabled={player?.savedCards.length === 0} onPress={() => setShowReserved(true)}>
            <BaseText>
              {`reserved ${player?.savedCards.length}/3`}
            </BaseText>
          </ShowDeckButton>
          <ShowDeckButton disabled={player?.cards.length === 0} onPress={() => setShowReserved(true)}>
            <BaseText>
              owned {`(${player?.cards.length})`}
            </BaseText>
          </ShowDeckButton>
        </FlexColumn> : null}
      </StyledRow>
    </StyledImageBackground>
    <CardsCarouselModal cards={player?.savedCards ?? []} visible={showReserved} setModalOpen={setShowReserved} />
    <CardsCarouselModal cards={player?.cards ?? []} visible={showOwned} setModalOpen={setShowOwned} />
  </PlayerData>;
};

const ShowDeckButton = styled(StyledButton)<{disabled?:boolean}>`
  ${({disabled})=> disabled ? 'opacity:.65;' : ''}
  width: 100px;
  height: 25px;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const StyledRow = styled(FlexRow)`
  padding: 5px;
`;
const PrestigeValue = styled.View``;
const CoinValue = styled.View``;
const CountContainer = styled.View`
  margin-right: 10px;
`;

const StyledImageBackground = styled.ImageBackground`
  height: 100%;
  width: 100%;
  flex: 1;
`;
const PlayerData = styled(FlexColumn)`
  flex-wrap: wrap;
  height: 100%;
  min-width: 350px;
  flex: 1;
  justify-content: center;
`;

