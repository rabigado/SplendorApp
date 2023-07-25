export const GemsIcons = [
  require("../assets/images/gems/gold.png"),
  require("../assets/images/gems/ruby.png"),
  require("../assets/images/gems/sapphire.png"),
  require("../assets/images/gems/onyx.png"),
  require("../assets/images/gems/emerald.png"),
  require("../assets/images/gems/diamond.png")
];

export enum GemType {
  Ruby= 1,
  Sapphire = 2,
  Onyx= 3,
  Emerald= 4,
  Diamond= 5,
}

export enum CardCost {
  r = 'red',
  u = 'blue',
  w = 'white',
  g = 'green',
  k = 'black'
}

export function mapCharToGemType(char: string){
  switch (char){
    case 'red':
      return GemType.Ruby;
    case 'blue':
      return GemType.Sapphire;
    case 'white':
      return GemType.Diamond;
    case 'green':
      return GemType.Emerald;
    case 'black':
      return GemType.Onyx;
  }
}

export function getGemByColor(color: string): IGem | undefined{
  switch (color){
    case 'red':
      return { imageIndex:GemType.Ruby,color, coinIndex:GemType.Ruby };
    case 'blue':
      return { imageIndex:GemType.Sapphire,color, coinIndex:GemType.Sapphire };
    case 'white':
      return { imageIndex:GemType.Diamond,color, coinIndex:GemType.Diamond };
    case 'green':
      return { imageIndex:GemType.Emerald,color, coinIndex:GemType.Emerald };
    case 'black':
      return { imageIndex:GemType.Onyx,color, coinIndex:GemType.Onyx };
  }
}

export interface IGem {
  imageIndex: GemType;
  color: 'white' | 'blue' | 'green' | 'red' | 'black' | 'yellow';
  coinIndex: number
}

