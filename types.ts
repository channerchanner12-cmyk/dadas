
export interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  isSelf: boolean;
}

export interface UserIdentity {
  name: string;
  color: string;
}
