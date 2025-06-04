export interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  numberOfParticipants?: number;
  genre?: string;
}
