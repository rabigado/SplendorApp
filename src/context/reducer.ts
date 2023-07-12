import { ISettings } from '../Entities/Settings';
import { IPlayer } from '../Entities/Player';
import { Dealer, ICard, IDealer } from '../Entities/Deck';

export enum ActionTypes {
  SETTINGS='SETUP_SETTINGS'
}
export interface IAction {
  type: ActionTypes;
  gameState: Partial<IGameState>;
}

type CardRowTuple = [ICard | null, ICard | null, ICard | null, ICard | null];

export interface IBoard{
  row1:CardRowTuple
  row2:CardRowTuple
  row3:CardRowTuple
}
export interface IGameState {
  settings?: ISettings;
  players: IPlayer[];
  dealer?: IDealer;
  board: IBoard;
}
export const gameInitialState: IGameState = {
  settings: undefined,
  players: [],
  dealer: undefined,
  board: {
    row1: new Array(4).fill(null) as CardRowTuple,
    row2: new Array(4).fill(null) as CardRowTuple,
    row3: new Array(4).fill(null) as CardRowTuple
  }
};
export const gameReducer = (state: IGameState, action: IAction) => {
  switch (action.type) {
    case ActionTypes.SETTINGS:
      const newSettings = action.gameState.settings ?? state.settings;
      const dealer = new Dealer();
      const board = {
        row1: new Array(4).fill(null).map(_=>dealer.getCardByLevel(0)) as CardRowTuple,
        row2: new Array(4).fill(null).map(_=>dealer.getCardByLevel(1)) as CardRowTuple,
        row3: new Array(4).fill(null).map(_=>dealer.getCardByLevel(2)) as CardRowTuple
      };
      return {...state, settings: newSettings, players: action.gameState.players, dealer: dealer, board} as IGameState;
    default:
      return state;
  }
};
