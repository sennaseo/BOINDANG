declare module '@woowa-babble/random-nickname' {
  type NicknameType = 'animals' | 'heros' | 'characters' | 'monsters';
  
  export function getRandomNickname(type: NicknameType): string;
} 