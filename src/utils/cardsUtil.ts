import { ICard } from '../Entities/Deck';
import { GemType, IGem } from '../Entities/Gem';
import { IPlayer } from '../Entities/Player';
import { every, first, forEach, groupBy, reduce } from 'lodash';
import { ActionTypes, IAction, IBank, IGameState } from '../context/reducer';

const MIN_NOBLE_COST_LENGTH = 8;

export const nobleVisitPlayer = (nobles:ICard[], cards:ICard[]):ICard | undefined =>{
  if (cards.length < MIN_NOBLE_COST_LENGTH){
    return;
  }
  const approvingNobles = nobles.filter((noble)=>{
    const price = reduce(noble.cost,(acc,curr)=>{
      acc[curr.color] ? acc[curr.color] += 1 : acc[curr.color] = 1;
      return acc;
    },{} as {[key:string]:number});
    return every(price,(value, index)=>{
      return cards.filter(card=>card.color === index).length >= value;
    });
  });
  return first(approvingNobles);
};

export const canPlayerBuyCard = (selectedCard: ICard, player:IPlayer) => {
  if (!selectedCard ||  player.cards.some(card=> card.id === selectedCard.id)) {
    return false;
  }
  const playerGemCounts = {
    [GemType.Ruby]: player.playerGems[GemType.Ruby].length,
    [GemType.Onyx]: player.playerGems[GemType.Onyx].length,
    [GemType.Emerald]: player.playerGems[GemType.Emerald].length,
    [GemType.Sapphire]: player.playerGems[GemType.Sapphire].length,
    [GemType.Diamond]: player.playerGems[GemType.Diamond].length,
  };

  player.cards.forEach(card => {
    if (card.gemValue){
      playerGemCounts[card.gemValue.imageIndex]++;
    }
  });

  // Check if the player can afford the card
  let totalShortfall = 0;
  for (let costGem of selectedCard.cost) {
    const { imageIndex } = costGem;
    if (playerGemCounts[imageIndex] > 0) {
      playerGemCounts[imageIndex]--;
    } else {
      totalShortfall++;
    }
  }

  return totalShortfall <= player.gold;
};

export const buyCard = (cardToBuy: ICard,player:IPlayer, game:IGameState):IAction => {
  const freePoints = groupBy(player.cards.filter(card=>card.gemValue).map(card => card.gemValue), card => card.color);
  const payPoints = groupBy(cardToBuy?.cost, gem => gem.color);
  forEach(payPoints, (value, key) => {
    if (freePoints[key]) {
      value.splice(0, freePoints[key].length);
    }
    if (value.length){
      const deleteCount = player.playerGems[value[0].imageIndex]?.length ?? 0;
      value.forEach(remainingCost => {
        const coin = player.playerGems[remainingCost.imageIndex].pop() as IGem;
        if (coin){
          game.bank[coin.imageIndex].push(coin);
        }
      });
      value.splice(0, deleteCount);
    }

    if (value.length > 0) {
      if (player.gold < value.length) {
        throw 'Player can not buy this card, no gold left!';
      }
      player.gold -= value.length;
      value.forEach(_ => {
        game.bank.Gold.push({
          imageIndex: 0,
          coinIndex: 0,
          color: 'yellow',
        });
      });
    }
  });
  return {
    type: ActionTypes.PLAYER_BUY_CARD,
    card: cardToBuy,
    gameState: game,
  };
};
