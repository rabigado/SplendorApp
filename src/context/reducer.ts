import { ISettings } from '../Entities/Settings';
import { IPlayer } from '../Entities/Player';
import { getCardByLevel, ICard, IDealer, mapJsonToCard, NobleImages } from '../Entities/Deck';
import { GemType, IGem } from '../Entities/Gem';
import jsonCards from '../assets/cards.json';
import { act } from 'react-test-renderer';

export enum ActionTypes {
  SETTINGS = 'SETUP_SETTINGS',
  COIN_TO_PLAYER='COIN_TO_PLAYER',
  PLAYER_BUY_CARD='PLAYER_BUY_CARD',
  PLAYER_RESERVE_CARD='PLAYER_RESERVE_CARD',
  PLAYER_BUY_RESERVED_CARD='PLAYER_BUY_RESERVED_CARD'
}

export interface IAction {
  type: ActionTypes;
  gameState: Partial<IGameState>;
  card?:ICard
  tempCoins?:IGem[]
}

type CardRowTuple = [ICard | null, ICard | null, ICard | null, ICard | null];

export interface IBoard {
  row1: CardRowTuple;
  row2: CardRowTuple;
  row3: CardRowTuple;
}

type IBank = {
  [key in GemType | 'Gold']: IGem[];
}

export interface IGameState {
  settings?: ISettings;
  players: IPlayer[];
  dealer?: IDealer;
  board: IBoard;
  bank: IBank;
  currentPlayerId: number;
  currentRound: number;
  playersAction?: IAction;
}

export const gameInitialState: IGameState = {
  settings: undefined,
  players: [],
  dealer: undefined,
  currentPlayerId: 0,
  currentRound: 1,
  board: {
    row1: new Array(4).fill(null) as CardRowTuple,
    row2: new Array(4).fill(null) as CardRowTuple,
    row3: new Array(4).fill(null) as CardRowTuple,
  },
  bank: {
    [GemType.Onyx]: [],
    [GemType.Ruby]: [],
    [GemType.Emerald]: [],
    [GemType.Sapphire]: [],
    [GemType.Diamond]: [],
    Gold: [],
  },
};
export const gameReducer = (state: IGameState, action: IAction) => {
  let cards = state.players[state.currentPlayerId].cards;
  switch (action.type) {
    case ActionTypes.PLAYER_BUY_RESERVED_CARD:
      if (action.card){
        const card =  cards?.splice(cards.findIndex(cardInRow => cardInRow?.id === action.card!.id),1)[0];
        card && state.players[state.currentPlayerId].savedCards.push(card);
      }
      return {...state, currentPlayerId: ((state.currentPlayerId + 1) % state.players.length)};
    case ActionTypes.PLAYER_RESERVE_CARD:
      if (action.card){ //TODO: unify duplicate
        const cardLevel = action.card.cardLevel  as 1|2|3;
        const row = state.board?.[`row${cardLevel}`];
        const card = row?.splice(row.findIndex(cardInRow => cardInRow?.id === action.card!.id),1)[0];
        const newCard = card ? state.dealer?.cards[card.cardLevel]?.pop() : undefined;
        newCard && row.push(newCard);
        card && state.players[state.currentPlayerId].savedCards.push(card);
      }
      return {...state, currentPlayerId: ((state.currentPlayerId + 1) % state.players.length)};
    case ActionTypes.PLAYER_BUY_CARD:
      if (action.card){
        const cardLevel = action.card.cardLevel  as 1|2|3;
        const row = state.board?.[`row${cardLevel}`];
        const card = row?.splice(row.findIndex(cardInRow => cardInRow?.id === action.card!.id),1)[0];
        const newCard = card ? state.dealer?.cards[card.cardLevel]?.pop() : undefined;
        newCard && row.push(newCard);
        card && cards.push(card);
      }
      return {...state, currentPlayerId: ((state.currentPlayerId + 1) % state.players.length)};
    case ActionTypes.COIN_TO_PLAYER:
      action.tempCoins?.forEach(coin=>{
        state.players[state.currentPlayerId].playerGems[coin.imageIndex].push(coin);
      });
      return { ...state,
        currentRound: action.gameState.currentRound,
        players:[...action.gameState.players!],
        bank: state.bank,
        currentPlayerId: ((state.currentPlayerId + 1) % state.players.length),
         }  as IGameState;
    case ActionTypes.SETTINGS:
      const newSettings = action.gameState.settings ?? state.settings;

      const dealer:IDealer = {
        cards: [
          mapJsonToCard(1),
          mapJsonToCard(2),
          mapJsonToCard(3),
        ],
        nobles: jsonCards.nobles.map((noble,index) => {
          return {
            id: index,
            cardLevel: 4,
            cardBackIndex: 3,
            imageIndex: Math.round(Math.random() * NobleImages.length),
            //TODO: noble cost!
          } as ICard;
        }),
      };
      const board = {
        row1: state.board.row1.map(_ => getCardByLevel(dealer, 0)) as CardRowTuple,
        row2: state.board.row2.map(_ => getCardByLevel(dealer, 1)) as CardRowTuple,
        row3: state.board.row3.map(_ => getCardByLevel(dealer, 2)) as CardRowTuple,
      };
      return {
        ...state,
        settings: newSettings,
        players: action.gameState.players,
        dealer: dealer,
        board,
        bank: {
          [GemType.Onyx]: new Array(newSettings?.numberOfTokens).fill({ //TODO: repetitive, make better.
            imageIndex: GemType.Onyx,
            coinIndex: GemType.Onyx,
            color: 'black',
          } as IGem),
          [GemType.Ruby]: new Array(newSettings?.numberOfTokens).fill({
            imageIndex: GemType.Ruby,
            coinIndex: GemType.Ruby,
            color: 'red',
          } as IGem),
          [GemType.Emerald]: new Array(newSettings?.numberOfTokens).fill({
            imageIndex: GemType.Emerald,
            coinIndex: GemType.Emerald,
            color: 'green',
          } as IGem),
          [GemType.Sapphire]: new Array(newSettings?.numberOfTokens).fill({
            imageIndex: GemType.Sapphire,
            coinIndex: GemType.Sapphire,
            color: 'blue',
          } as IGem),
          [GemType.Diamond]: new Array(newSettings?.numberOfTokens).fill({
            imageIndex: GemType.Diamond,
            coinIndex: GemType.Diamond,
            color: 'white',
          } as IGem),
          'Gold': new Array(newSettings?.goldTokens).fill({
            imageIndex: 0 as GemType,
            coinIndex: 0,
            color: 'yellow',
          } as IGem),
        },
      } as IGameState;
    default:
      return state;
  }
};
