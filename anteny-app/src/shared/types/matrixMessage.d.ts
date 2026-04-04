export interface Message {
  id: string;
  roomId: string;
  sender: string;
  body: string;
  timestamp: number;
  type: string;
  msgtype?: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  editedEventId?: string;
}

