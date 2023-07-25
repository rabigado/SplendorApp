import React, { createContext, FC, PropsWithChildren, useReducer, useState } from 'react';
import { gameInitialState, gameReducer, IAction, IGameState } from './reducer';

interface IGameContext {
  game: IGameState;
  dispatch: React.Dispatch<IAction>;
  currentPlayerAction?: IAction;
  setPlayerAction: (action: IAction | undefined) => void;
}

export const GameContext = createContext<IGameContext>({} as IGameContext);

export const GameContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [game, dispatch] = useReducer(gameReducer, gameInitialState);
  const [currentPlayerAction, setPlayerAction] = useState<IAction | undefined>();
  return (
    <GameContext.Provider value={{ game, dispatch, currentPlayerAction, setPlayerAction }}>
      {children}
    </GameContext.Provider>
  );
};
