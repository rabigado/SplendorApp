import React, { createContext, FC, PropsWithChildren, useReducer } from 'react';
import { gameInitialState, gameReducer, IAction, IGameState } from './reducer';

interface IGameContext {
  game: IGameState;
  dispatch: React.Dispatch<IAction>;
}

export const GameContext = createContext<IGameContext>({} as IGameContext);

export const GameContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [game, dispatch] = useReducer(gameReducer, gameInitialState);
  return (
    <GameContext.Provider value={{ game, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};
