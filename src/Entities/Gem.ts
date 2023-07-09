export const GemsIcons = [
  require('../assets/images/gems/gold.png'),
  require('../assets/images/gems/ruby.png'),
  require('../assets/images/gems/sapphire.png'),
  require('../assets/images/gems/onyx.png'),
  require('../assets/images/gems/emerald.png'),
  require('../assets/images/gems/diamond.png'),
];
export enum GemType {
  Gold,
  Ruby,
  Sapphire,
  Onyx,
  Emerald,
  Diamond,
}
export interface IGem {
  imageIndex: GemType;
}
