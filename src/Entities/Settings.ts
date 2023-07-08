import { IPlayer } from "./Player";

export const playersImages = [require('../assets/images/players/player1.png'),
  require('../assets/images/players/player2.png'),
  require('../assets/images/players/player3.png'),
  require('../assets/images/players/player4.png'),
  require('../assets/images/players/player5.png'),
  require('../assets/images/players/player6.png'),
  require('../assets/images/players/player7.png'),
  require('../assets/images/players/player8.png'),
  require('../assets/images/players/player9.png'),
]

export const GemsIcons = [require('../assets/images/gems/diamond.png'),
  require('../assets/images/gems/gold.png'),
  require('../assets/images/gems/ruby.png'),
  require('../assets/images/gems/sapphire.png'),
  require('../assets/images/gems/onyx.png'),
  require('../assets/images/gems/emerald.png'),
]
export interface ISettings {
  players:IPlayer[]
  winCondition: number;
  numberOfTokens: number;
  goldTokens: number;
  nobles: number;
}

export class Settings implements ISettings{
  _goldTokens = 5;
  _nobles = 3;
  _numberOfTokens = 4;
  _players = [] as IPlayer[];
  _winCondition = 15;

  constructor() {

  }

  set players(players:IPlayer[]){
    this._players = players;
    this._nobles = players.length + 1;
    this._numberOfTokens = players.length < 3 ? 4 : players.length === 4 ? 7 : 5;
  }
  get winCondition(){
    return this._winCondition;
  }
  get players(){
    return this._players;
  }
  get numberOfTokens(){
    return this._numberOfTokens;
  }
  get nobles(){
    return this._nobles;
  }
  get goldTokens(){
    return this._goldTokens;
  }


}
