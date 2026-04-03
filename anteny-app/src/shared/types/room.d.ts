export interface RoomMember {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
}

export interface ChatRoom {
  room_id: string;
  name?: string;
  avatar?: string;
  members: RoomMember[];
  isDirect: boolean;
  otherUser?: {
    user_id: string;
    displayname: string;
  };
  isInvite?: boolean;
}

