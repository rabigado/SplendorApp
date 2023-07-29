import { GemType, IGem } from './Gem';
import { ICard } from './Deck';


export interface IPlayer {
  id:number;
  playerName: string;
  imageIndex: number
  playerGems: {
    [GemType.Ruby]: IGem[]
    [GemType.Onyx]: IGem[]
    [GemType.Emerald]: IGem[]
    [GemType.Sapphire]: IGem[]
    [GemType.Diamond]: IGem[]
  },
  cards: ICard[];
  savedCards: ICard[]
  gold: number;
  aiPlayer: boolean;
}
