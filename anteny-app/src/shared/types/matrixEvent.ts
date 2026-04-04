export interface MatrixEvent {
  type: string;
  sender: string;
  content: Record<string, unknown>;
  event_id: string;
  roomId?: string;
  origin_server_ts?: number;
  unsigned?: Record<string, unknown>;
  age?: number;
  ["m.relates_to"]?: {
    rel_type?: string;
    event_id?: string;
  };
  redacts?: string;
}


