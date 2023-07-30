import { ISettings } from '../Entities/Settings';
import { IPlayer } from '../Entities/Player';
import { getCardByLevel, ICard, IDealer, mapJsonToCard, NobleImages } from '../Entities/Deck';
import { GemType, getGemByColor, IGem } from '../Entities/Gem';
import jsonCards from '../assets/cards.json';
import { nobleVisitPlayer } from '../utils/cardsUtil';
import { cloneDeep, isNumber, map, shuffle, take } from 'lodash';

export enum ActionTypes {
  NEW_GAME = 'NEW_GAME',
  END_TURN = 'END_TURN',
  SETTINGS = 'SETUP_SETTINGS',
  COIN_TO_PLAYER = 'COIN_TO_PLAYER',
  PLAYER_BUY_CARD = 'PLAYER_BUY_CARD',
  PLAYER_RESERVE_CARD = 'PLAYER_RESERVE_CARD',
  PLAYER_BUY_RESERVED_CARD = 'PLAYER_BUY_RESERVED_CARD'
}

export interface IAction {
  type: ActionTypes;
  gameState: Partial<IGameState>;
  card?: ICard;
  tempCoins?: IGem[];
}

type CardRowTuple = [ICard | null, ICard | null, ICard | null, ICard | null];

export interface IBoard {
  row1: CardRowTuple;
  row2: CardRowTuple;
  row3: CardRowTuple;
}

export type IBank = {
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
  nobles: ICard[];
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
  nobles: [],
};

export const gameReducer = (state: IGameState, action: IAction) => {
  let nextPlayerId = (isNumber(state.currentPlayerId) && state.players) ? (state.currentPlayerId + 1) % state.players?.length : 0;
  switch (action.type) {
    case ActionTypes.END_TURN:
      return { ...state, currentPlayerId: nextPlayerId,
        currentRound: nextPlayerId === 0 ? state.currentRound + 1 : state.currentRound, };

    case ActionTypes.PLAYER_BUY_RESERVED_CARD:
      let cards = state.players[state.currentPlayerId].savedCards;
      if (action.card) {
        const card = cards?.splice(cards.findIndex(cardInRow => cardInRow?.id === action.card!.id), 1)[0];
        let player = state.players[state.currentPlayerId];
        card && player.cards.push(card);
        const noble = nobleVisitPlayer(state.nobles, player.cards);
        if (noble) {
          state.nobles.splice(state.nobles.findIndex(n => n.id === noble.id), 1);
          player.cards.push(noble);
        }
      }
      return {
        ...state,
        currentPlayerId: nextPlayerId,
        currentRound: nextPlayerId === 0 ? state.currentRound + 1 : state.currentRound,
      } as IGameState;

    case ActionTypes.PLAYER_RESERVE_CARD:
      if (action.card) { //TODO: unify duplicate
        const cardLevel = action.card.cardLevel as 1 | 2 | 3;
        const row = state.board?.[`row${cardLevel}`];
        const card = row?.splice(row.findIndex(cardInRow => cardInRow?.id === action.card!.id), 1)[0];
        const newCard = card ? state.dealer?.cards[card.cardLevel - 1]?.pop() : undefined;
        newCard && row.push(newCard);
        card && state.players[state.currentPlayerId].savedCards.push(card);
      }
      return { ...state, currentPlayerId: nextPlayerId, currentRound: nextPlayerId === 0 ? state.currentRound + 1 : state.currentRound };
    case ActionTypes.PLAYER_BUY_CARD:
      if (action.card) {
        const cardLevel = action.card.cardLevel as 1 | 2 | 3;
        const row = state.board?.[`row${cardLevel}`];
        const card = row?.splice(row.findIndex(cardInRow => cardInRow?.id === action.card!.id), 1)[0];
        const newCard = card ? state.dealer?.cards[card.cardLevel - 1]?.pop() : undefined;
        const player = state.players[state.currentPlayerId];
        newCard && row.push(newCard);
        card && player.cards.push(card);
        const noble = nobleVisitPlayer(state.nobles, player.cards);
        if (noble) {
          state.nobles.splice(state.nobles.findIndex(n => n.id === noble.id), 1);
          player.cards.push(noble);
        }
      }
      return { ...state, currentPlayerId: nextPlayerId, currentRound: nextPlayerId === 0 ? state.currentRound + 1 : state.currentRound };
    case ActionTypes.COIN_TO_PLAYER:
      action.tempCoins?.forEach(coin => {
        state.players[state.currentPlayerId].playerGems[coin.imageIndex].push(coin);
      });
      return {
        ...state,
        currentRound: nextPlayerId === 0 ? state.currentRound + 1 : state.currentRound,
        players: [...action.gameState.players!],
        bank: action.gameState.bank,
        currentPlayerId: nextPlayerId,

      } as IGameState;
    case ActionTypes.SETTINGS:
      const newSettings = action.gameState.settings as ISettings;
      const dealer: IDealer = {
        cards: [
          mapJsonToCard(1),
          mapJsonToCard(2),
          mapJsonToCard(3),
        ],
        nobles: jsonCards.nobles.map((noble, index) => {
          return {
            id: index,
            cardLevel: 4,
            cardBackIndex: 3,
            value: 3,
            imageIndex: Math.floor(Math.random() * NobleImages.length),
            cost: map(noble.cost, (value, key) => new Array(value)
              .fill(getGemByColor(key))).flat() as IGem[],
          } as ICard;
        }),
      };

      const board = {
        row1: state.board.row1.map(_ => getCardByLevel(dealer, 0)) as CardRowTuple,
        row2: state.board.row2.map(_ => getCardByLevel(dealer, 1)) as CardRowTuple,
        row3: state.board.row3.map(_ => getCardByLevel(dealer, 2)) as CardRowTuple,
      };
      return {
        ...gameInitialState,
        nobles: take(shuffle(dealer.nobles), newSettings?.nobles),
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
    case ActionTypes.NEW_GAME:
      return cloneDeep(gameInitialState);
    default:
      return state;
  }
};
