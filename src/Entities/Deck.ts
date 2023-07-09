import {IGem} from './Gem';

export interface IDeck {
  cards: ICard[];
}
export const CardsBack = [
  require('../assets/images/card1back.png'),
  require('../assets/images/card2back.png'),
  require('../assets/images/card3back.png'),
];
export interface ICard {
  imageIndex: number;
  value?: number;
  gemValue: IGem;
  cost: IGem[];
  cardBackIndex: number;
  cardLevel: number;
}
