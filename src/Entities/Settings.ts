import {IPlayer} from './Player';

export const playersImages = [
  require('../assets/images/players/player1.png'),
  require('../assets/images/players/player2.png'),
  require('../assets/images/players/player3.png'),
  require('../assets/images/players/player4.png'),
  require('../assets/images/players/player5.png'),
  require('../assets/images/players/player6.png'),
  require('../assets/images/players/player7.png'),
  require('../assets/images/players/player8.png'),
  require('../assets/images/players/player9.png'),
];

export interface ISettings {
  winCondition: number;
  numberOfTokens: number;
  goldTokens: number;
  nobles: number;
}
