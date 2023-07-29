import { isUndefined, last, map, noop, sum, values } from 'lodash';
import { BaseText, Coin, FlexColumn, FlexRow, GemImage } from '../../shardStyles';
import { GemsIcons, GemType, IGem } from '../../Entities/Gem';
import theme from '../../theme/theme';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { GameContext } from '../../context/context';
import { ActionTypes } from '../../context/reducer';
import Toast from 'react-native-toast-message';


export default () => {
  const { game, setPlayerAction, currentPlayerAction } = useContext(GameContext);
  const [tempCoins, setTempCoins] = useState([] as IGem[]);

  const [localBank, setLocalBank] = useState({ ...game.bank });

  useEffect(() => {
    setLocalBank(game.bank);
  }, [game.currentPlayerId]);


  useEffect(() => {
    resetState();
  }, [game.currentPlayerId, game.currentRound]);

  const resetState = () => {
    setLocalBank({ ...game.bank });
    setTempCoins([]);
  };

  const giveCoinToPlayer = (gem: IGem) => {
    if (currentPlayerAction && currentPlayerAction.type !== ActionTypes.COIN_TO_PLAYER) {
      return;
    }
    if (tempCoins.length === 2 && tempCoins.every(coin => coin.color === tempCoins[0].color)) {
      Toast.show({
        type: 'info',
        text1: 'Already have 2 coins of same type'
      });
      return;
    }
    const player = game.players[game.currentPlayerId];
    const canPlayerTakeMoreCoins = (sum([...values(player.playerGems).map(arr => arr.length), player.gold]) + tempCoins.length) < 10;
    const hasTakenSameCoinType = tempCoins.some(tempGem => tempGem.color === gem.color);
    const maxCoinPerTurnTaken = tempCoins.length < (hasTakenSameCoinType ? 2 : 3);
    const enoughCoinsLeft = hasTakenSameCoinType ? localBank[gem.imageIndex].length > 3 : localBank[gem.imageIndex].length > 0;
    if (canPlayerTakeMoreCoins && maxCoinPerTurnTaken && enoughCoinsLeft) {
      setTempCoins(prev => [...prev, localBank[gem.coinIndex as GemType].pop() as IGem]);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Can\'t take more coins'
      });
    }
  };

  useEffect(() => {
    if (tempCoins.length) {
      setPlayerAction({
        type: ActionTypes.COIN_TO_PLAYER,
        tempCoins,
        gameState: {
          ...game,
          bank: localBank
        }
      });
    }
  }, [tempCoins]);


  return <BankSection size={game.settings?.numberOfTokens ?? 4}>
    {map(localBank, ((gems, index) => {
      const gem = last(gems);
      if (!isUndefined(gem)) {
        return <RelativeRow key={`row=${gem.color}`}>
          <AmountOfCoins>{gems.length}</AmountOfCoins>
          <CoinsStash onPressOut={() => index === 'Gold' ? noop() : giveCoinToPlayer(gem)}>
            {gems.map((coin, i) => <BankCoin key={`${coin.color}-${i}`} color={coin.color} size={50} left={i * 8}>
              <GemImage
                size={40}
                source={GemsIcons[coin.imageIndex]}
                resizeMethod={'resize'} />
            </BankCoin>)}
          </CoinsStash>
        </RelativeRow>;
      }
      return <RelativeRow key={`row=${index}`}>
        <AmountOfCoins>{gems.length}</AmountOfCoins>
        <CoinsStash onPress={noop}>
          <GemImage
            size={40}
            source={GemsIcons[Number(index)]}
            resizeMethod={'resize'} />
        </CoinsStash>
      </RelativeRow>;
    }))}
  </BankSection>;
};

const CoinsStash = styled.TouchableOpacity`
  margin-left: 10px;
  z-index: 100;
`;

const BankSection = styled(FlexColumn)<{ size: number }>`
  width: ${({ size }) => size * 22}px;
`;

const AmountOfCoins = styled(BaseText)`
  color: ${theme.colors.white};
  font-weight: 600;
  margin-top: auto;
  margin-bottom: auto;
  padding-left: 5px;
  font-size: 16px;
`;

const BankCoin = styled(Coin)<{ left?: number }>`
  transform: rotateY(18deg) rotateX(45deg);
  position: absolute;
  left: ${({ left }) => left ?? 0}px;
`;

const RelativeRow = styled(FlexRow)`
  position: relative;
  flex: 1;
`;
