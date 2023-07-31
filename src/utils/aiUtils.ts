import { IPlayer } from '../Entities/Player';
import { ICard } from '../Entities/Deck';
import { ActionTypes, IAction, IBank, IGameState } from '../context/reducer';
import { buyCard, canPlayerBuyCard } from './cardsUtil';
import { IGem } from '../Entities/Gem';
import { cloneDeep, Comparator, forEach, maxBy, omit, sum, uniqWith, values } from 'lodash';

const sortCardByCost = (cards: ICard[]) => {
  return [...cards].sort((a, b) => {
    const totalCostA = a.cost.length;
    const totalCostB = b.cost.length;
    return totalCostA - totalCostB;
  });

};

export function aiTurn(player: IPlayer, bank: IBank, cards: ICard[], game:IGameState):IAction {
  // Sort the cards by cost
  const localBank = cloneDeep(bank);
  const sortedCards = sortCardByCost(cards);
  const sortedReservedCards = sortCardByCost(player.savedCards);

  // Try to buy each card, starting with the cheapest
  for (let card of sortedReservedCards) {
    if (canPlayerBuyCard(card, player)) {
      const action = buyCard(card,player,game);
      return { ...action, type: ActionTypes.PLAYER_BUY_RESERVED_CARD };
    }
  }

  const canBuy = sortedCards.filter(card => canPlayerBuyCard(card, player));
  if (canBuy.length){
    const maxCardByValue = maxBy(canBuy,c=>c.value ?? 0) as ICard;
    return buyCard(maxCardByValue,player,game);
  }

  if (localBank.Gold.length && player.savedCards.length < 3 && Math.random() > 0.6) {
    return {
      type: ActionTypes.PLAYER_RESERVE_CARD,
      card: sortedCards[Math.floor(Math.random() * sortedCards.length)],
      gameState:game,
    };
  }
  // If the AI can't afford any card, take gems from the bank
  const gems: IGem[] = [];
  for (let card of sortedCards){
    const gemsNeeded = card.cost;
    for (let gem of gemsNeeded) {
      if (gems.length === 2 && gems.every(coin => coin.color === gems[0].color) || gems.length === 3) {
        break;
      }
      if (localBank[gem.imageIndex].length > 0 && canPlayerTakeCoin(gem, gems, player, localBank)) {
        gems.push(localBank[gem.imageIndex].pop() as IGem);
      }
    }
  }

  if (gems.length <= 2 && areAllElementsUnique(gems,(gemA,gemB)=>gemA.color === gemB.color)){
    forEach(omit(localBank,'Gold'), (value)=>{
      if (value.length && canPlayerTakeCoin(value[0],gems,player,localBank)){
        gems.push(value.pop() as IGem);
      }
    });
  }

  return {
    type: ActionTypes.COIN_TO_PLAYER,
    tempCoins: gems,
    gameState: {
      ...game,
      bank: localBank,
    },
  };
}

const canPlayerTakeCoin = (gem: IGem, gems: IGem[], player: IPlayer, localBank:IBank) => {
  try {
    const canPlayerTakeMoreCoins = (sum([...values(player.playerGems).map(arr => arr.length), player.gold]) + gems.length) < 10;
    const hasTakenSameCoinType = gems.some(tempGem => tempGem.color === gem.color);
    const maxCoinPerTurnTaken = gems.length < (hasTakenSameCoinType ? 2 : 3);
    const canTakeCoinFromBank = hasTakenSameCoinType ? localBank[gem.imageIndex].length > 3 : localBank[gem.imageIndex].length > 0;
    return canPlayerTakeMoreCoins && maxCoinPerTurnTaken && canTakeCoinFromBank;
  } catch (err){
    console.log('***************************');
    console.log(err);
    console.log('localBank, gem,localBank[gem.imageIndex] is:',localBank, gem,localBank[gem.imageIndex]);
    console.log('***************************');
  }
};


function areAllElementsUnique<T>(arr:T[],accessor:Comparator<T>) {
  const uniqueElements = uniqWith<T>(arr, accessor);
  return uniqueElements.length === arr.length;
}
