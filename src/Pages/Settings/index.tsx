import { BaseText, FullPageView } from '../../shardStyles';
import theme, { colors } from '../../theme/theme';
import React, { useContext, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../Game';
import StartGameButton from '../../Components/3DButton/index';
import { ISettings, playersImages } from '../../Entities/Settings';
import { GemsIcons, GemType } from '../../Entities/Gem';
import styled from 'styled-components/native';
import { IPlayer } from '../../Entities/Player';
import RefreshImageIcon from '../../assets/images/icons/activity.svg';
import AddPlayerIcon from '../../assets/images/icons/addPlayerIcon.svg';
import RemovePlayer from '../../assets/images/icons/removePlayer.svg';
import { View } from 'react-native';
import { ActionTypes } from '../../context/reducer';
import { GameContext } from '../../context/context';

export type SettingsProps = NativeStackScreenProps<
  RootStackParamList,
  'Settings'
>;
const MinPlayers = 2;
const MaxPlayers = 4;
const randomId = () => {
  return Math.random() * 100;
};
export default ({ navigation }: SettingsProps) => {
  const { dispatch } = useContext(GameContext);
  const [players, setPlayers] = useState<IPlayer[]>(
    new Array(MinPlayers).fill(0).map((_, index) => {
      return {
        id: randomId(),
        playerName: `Player-${index + 1}`,
        imageIndex: index,
        playerGems: {
          [GemType.Ruby]: [],
          [GemType.Onyx]: [],
          [GemType.Emerald]: [],
          [GemType.Sapphire]: [],
          [GemType.Diamond]: [],
        },
        cards: [],
        savedCards: [],
        gold: 0,
      };
    })
  );
  const settings: ISettings = {
    numberOfTokens: players.length < 2 ? 4 : players.length === 4 ? 7 : 5,
    winCondition: 15,
    nobles: players.length + 1,
    goldTokens: 5,
  };
  const handleChangeName = (index: number, event: string) => {
    const values = [...players];
    values[index].playerName = event;
    setPlayers(values);
  };
  const handleImageChange = (index: number) => {
    const values = [...players];
    values[index].imageIndex =
      (values[index].imageIndex + 1) % playersImages.length;
    setPlayers(values);
  };

  const handleChangePlayer = (index: number, isRemove: boolean = false) => {
    setPlayers(
      !isRemove
        ? [
          ...players,
          {
            id: randomId(),
            playerName: `Player-${index + 1}`,
            imageIndex: index,
            playerGems: {
              [GemType.Ruby]: [],
              [GemType.Onyx]: [],
              [GemType.Emerald]: [],
              [GemType.Sapphire]: [],
              [GemType.Diamond]: [],
            },
            cards: [],
            gold: 0,
            savedCards: [],
          },
        ]
        : players.length > MinPlayers
          ? players.filter((_, indexToRemove) => index !== indexToRemove)
          : players
    );
  };

  const handleStartGame = () => {
    dispatch?.({
      type: ActionTypes.SETTINGS,
      gameState: { settings, players },
    });
  };

  return (
    <FullPageView background={colors.lightBlue}>
      <PlayerContainer>
        {new Array(MaxPlayers).fill(0).map((_, index) => {
          return (
            <PlayerCard key={index}>
              {players[index] ? (
                <>
                  <ReplaceImage onPress={() => handleImageChange(index)}>
                    <RefreshImageIcon />
                  </ReplaceImage>
                  <RemovePlayerTouch
                    onPress={() => handleChangePlayer(index, true)}>
                    <RemovePlayer height={24} width={24} />
                  </RemovePlayerTouch>
                  <PlayerImage
                    resizeMethod={'resize'}
                    source={playersImages[players[index].imageIndex]}
                  />
                  <PlayerName
                    autoCorrect={true}
                    value={players[index].playerName ?? ''}
                    onChangeText={(name: string) => {
                      handleChangeName(index, name);
                    }}
                  />
                </>
              ) : (
                <AddPlayerTouch onPress={() => handleChangePlayer(index)}>
                  <AddPlayerIcon />
                </AddPlayerTouch>
              )}
            </PlayerCard>
          );
        })}
      </PlayerContainer>
      <GameDetailsContainer>
        <View>
          <DetailsText>Nobles: {settings.nobles}</DetailsText>
          <DetailsText>Tokens: {settings.numberOfTokens}</DetailsText>
          <DetailsText>Gold: {settings.goldTokens}</DetailsText>
          <DetailsText>Win at: {settings.winCondition}</DetailsText>
        </View>
        <View>
          {GemsIcons.map((gem, index) => {
            return (<GemImage key={index} source={gem} resizeMethod={'resize'} />);
          })}
        </View>
      </GameDetailsContainer>
      <StartNewGameButton>
        <StartGameButton
          title={'Venture forth'}
          onPress={() => {
            handleStartGame();
            navigation.navigate('Game');
          }}
        />
      </StartNewGameButton>
    </FullPageView>
  );
};

const StartNewGameButton = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const DetailsText = styled(BaseText)`
  font-size: ${theme.fontSizes.h4}px;
  font-weight: 600;
  margin: 10px;
`;

const GameDetailsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px;
`;

const AddPlayerTouch = styled.TouchableOpacity`
  padding: 10px;
`;

const ReplaceImage = styled.TouchableOpacity`
  position: absolute;
  z-index: 11;
  right: 5px;
  top: 5px;
`;
const RemovePlayerTouch = styled.TouchableOpacity`
  position: absolute;
  z-index: 11;
  top: 5px;
  left: 5px;
`;

const PlayerName = styled.TextInput`
  margin: 10px;
  height: 34px;
  border-radius: 8px;
  border-color: ${theme.colors.lightGold};
  border-width: 1px;
  font-size: ${theme.fontSizes.body1}px;
  color: ${theme.colors.white};
`;

const PlayerImage = styled.Image`
  max-width: 100%;
  max-height: 75%;
`;

const GemImage = styled.Image`
  width: 30px;
  height: 30px;
`;

const PlayerContainer = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const PlayerCard = styled.View`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  height: 200px;
  width: 150px;
  margin: 10px;
  border-radius: 8px;
  border: 1px solid ${theme.colors.gold};
`;
