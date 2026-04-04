export interface MatrixTimeline {
  eventId: string;
  roomId: string | undefined;
  sender: string;
  body: string;
  msgtype?: string;
  timestamp: number;
  redacts?: string;
  isSelf?: boolean;
  newMember?: {
    userId: string;
    membership: string;
    displayname?: string;
  };
}

