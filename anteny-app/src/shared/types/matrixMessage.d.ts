export interface Message {
  id: string;
  roomId: string;
  sender: string;
  body: string;
  timestamp: number;
  type: string;
  msgtype?: string;
}

