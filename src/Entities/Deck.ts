import { CardCost, getGemByColor, IGem, mapCharToGemType } from './Gem';
import jsonCards from '../assets/cards.json';
import { groupBy, map } from 'lodash';


export const CardsImages = [
  require('../assets/images/artisan1.jpg'),
  require('../assets/images/artisan2.jpg'),
  require('../assets/images/artisan3.jpg'),
  require('../assets/images/artisan4.jpg'),
  require('../assets/images/mine1.jpg'),
  require('../assets/images/mine2.jpg'),
  require('../assets/images/mine3.jpg'),
  require('../assets/images/mine4.png'),
  require('../assets/images/ship1.jpg'),
  require('../assets/images/ship2.jpg'),
  require('../assets/images/ship3.jpg'),
  require('../assets/images/ship4.jpg'),
];

export interface IDealer {
  cards: ICard[][];
  nobles: ICard[];
}

export const CardsBack = [
  require('../assets/images/card1back.png'),
  require('../assets/images/card2back.png'),
  require('../assets/images/card3back.png'),
];
export const NobleImages = [
  require('../assets/images/noble1.png'),
  require('../assets/images/noble2.png'),
  require('../assets/images/noble3.jpg'),
  require('../assets/images/noble4.jpg'),
];

export interface ICard {
  color: string;
  id: number;
  imageIndex: number;
  value?: number;
  gemValue: IGem;
  cost: IGem[];
  cardBackIndex: number;
  cardLevel: number;
}

const shuffle = <T>(arr: T[]) => {
  let currentIndex = arr.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
};
export function mapJsonToCard(level: number) {

  return shuffle(jsonCards.cards
    .filter(card => card.level === level)
  )
    .map(
      (card, index) =>
        ({
          id: index,
          color: card.color,
          cardBackIndex: level - 1,
          cardLevel: level,
          value: card.pv,
          //TODO: gemValue
          gemValue: getGemByColor(card.color),
          imageIndex: Math.floor(Math.random() * (CardsImages.length - 1)),
          cost:card.cost.split('+')
            .map(item=> new Array(Number(item[0])).fill(item[1])).flat().map((i:keyof typeof CardCost)=>CardCost[i]).map(color=>getGemByColor(color) as IGem),
        } as ICard)
    );
}

export function getCardByLevel(dealer:IDealer, level: 0 | 1 | 2): ICard | null {
  if (dealer.cards[level].length > 0) {
    return dealer.cards[level].pop() as ICard;
  }

  return null;
}
