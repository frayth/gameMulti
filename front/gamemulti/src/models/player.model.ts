export default interface Player {
  id: number;
  name: string;
  connected: boolean;
  ready?: boolean;
}
export type PlayerStatus = 'connect' | 'disconnect';