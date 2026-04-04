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
  replyTo?: string; // event_id del mensaje al que se responde
  replyToBody?: string; // preview del mensaje al que se responde
  replyToSender?: string; // nombre del usuario al que se responde
}

