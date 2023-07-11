export const GemsIcons = [
  require("../assets/images/gems/gold.png"),
  require("../assets/images/gems/ruby.png"),
  require("../assets/images/gems/sapphire.png"),
  require("../assets/images/gems/onyx.png"),
  require("../assets/images/gems/emerald.png"),
  require("../assets/images/gems/diamond.png")
];

export enum GemType {
  Gold,
  Ruby,
  Sapphire,
  Onyx,
  Emerald,
  Diamond,
}
export function mapCharToGemType(char: string){
  switch (char){
    case 'r':
      return GemType.Ruby;
    case 'u':
      return GemType.Sapphire;
    case 'w':
      return GemType.Diamond;
    case 'g':
      return GemType.Emerald;
    case 'b':
      return GemType.Onyx;
  }
}
export interface IGem {
  imageIndex: GemType;
  color: 'white' | 'blue' | 'green' | 'red' | 'black';
}
