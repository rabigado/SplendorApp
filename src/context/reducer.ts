import { ISettings } from '../Entities/Settings';
import { IPlayer } from '../Entities/Player';
import { Dealer, IDealer } from '../Entities/Deck';

export enum ActionTypes {
  SETTINGS='SETUP_SETTINGS'
}
export interface IAction {
  type: ActionTypes;
  gameState: Partial<IGameState>;
}
export interface IGameState {
  settings?: ISettings;
  players: IPlayer[];
  dealer?: IDealer;
}
export const gameInitialState: IGameState = {
  settings: undefined,
  players: [],
  dealer: undefined,
};
export const gameReducer = (state: IGameState, action: IAction) => {
  switch (action.type) {
    case ActionTypes.SETTINGS:
      const newSettings = action.gameState.settings ?? state.settings;
      return {...state, settings: newSettings, players: action.gameState.players, dealer: new Dealer()} as IGameState;
    default:
      return state;
  }
};
