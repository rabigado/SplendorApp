import {IGem, mapCharToGemType} from './Gem';
import jsonCards from '../assets/cards.json';
const CardsImages = [
  require('../assets/images/artisan1.jpg'),
  require('../assets/images/artisan2.jpg'),
  require('../assets/images/artisan3.jpg'),
  require('../assets/images/artisan4.jpg'),
  require('../assets/images/mine1.jpg'),
  require('../assets/images/mine2.jpg'),
  require('../assets/images/mine3.jpg'),
  require('../assets/images/mine4.jpg'),
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
const NobleImages = [
  require('../assets/images/noble1.png'),
  require('../assets/images/noble2.png'),
  require('../assets/images/noble3.png'),
  require('../assets/images/noble4.png'),
]
export interface ICard {
  imageIndex: number;
  value?: number;
  gemValue: IGem;
  cost: IGem[];
  cardBackIndex: number;
  cardLevel: number;
}

class Dealer implements IDealer {
  cards: ICard[][] = [];
  nobles:ICard[] = [];
  constructor() {
    const deck1 = this.mapJsonToCard(1);
    const deck2 = this.mapJsonToCard(2);
    const deck3 = this.mapJsonToCard(3);
    this.cards = [deck1, deck2, deck3];
    this.nobles = jsonCards.nobles.map(noble => {
      return {
        cardLevel: 4,
        cardBackIndex: 3,
        imageIndex: Math.round(Math.random()* NobleImages.length),
        //TODO: noble cost!
      } as ICard;
    });
  }
  getCardByLevel(level: number): ICard | null {
    if (this.cards[level].length > 0) {
      return this.cards[level].pop() as ICard;
    }

    return null;
  }
  mapJsonToCard(level: number) {
    return jsonCards.cards
      .filter(card => card.level === level)
      .shuffle()
      .map(
        card =>
          ({
            cardBackIndex: level,
            cardLevel: 1,
            imageIndex: Math.round(Math.random() * CardsImages.length),
            cost: card.cost.split('+').map(
              char =>
                ({
                  color: card.cost,
                  imageIndex: mapCharToGemType(char),
                } as IGem),
            ),
          } as ICard),
      );
  }
}
