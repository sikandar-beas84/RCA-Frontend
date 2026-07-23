export interface Conversation {
  id: number;

  participants: {
    id: number;

    user: {
      id: number;
      name: string;
      email: string;
    };
  }[];
}